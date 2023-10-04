const sequelize = require('sequelize');
const CustomError = require('../helpers/custom-error');
const { VALIDATION_ERROR, NOT_FOUND_ERROR } = require('../enums/error-codes');
const { paginate } = require('../helpers/paginate');

const { Op } = sequelize;

class BookService {
  constructor(database) {
    this.database = database;
    this.sequelize = this.database.sequelize;

    Object.assign(this, this.database.models);
  }


  async create(bookData) {
    const result = await this.Book.create({
      ...bookData,
    });

    if (!result) {
      throw new CustomError(400, 'Something went wrong.', VALIDATION_ERROR);
    }

    return result ;
  }


  async findAll({
    page,
    limit,
    filters,
  }) {

    const result = await this.Book.findAndCountAll({
      where: { 
        [Op.and]: filters 
      },
       order: [
        ['created_at', 'DESC'],
      ],
      ...paginate({ page, limit }),
    });

    return result;
  }


  async findById({ bookId, filters = []}) {
 
    const result = await this.Book.findOne({
      where: {
        [Op.and]: [
          {
            id:bookId
          },
          ...filters,
          
        ],
      },
    });

    if (!result) {
      throw new CustomError(404, 'Book not found.', NOT_FOUND_ERROR);
    }

    return result;
  }


  async update({ 
    bookId, 
    userId,
    data
  }) {
    
    const book = await this.findOne({ bookId, userId})

    await book.update({
      ...data
    })

    return this.findById({ bookId : book.id});
  }


  async delete({ bookId, userId}) {

    const book = await this.findOne({ bookId, userId})

    await book.destroy()
  }


  async findOne({ bookId, userId}) {

    const book = await this.Book.findOne({
      where: {
        [Op.and]: [
          {
            id:bookId
          },
          {
            user_id: userId
          }
        ],
      },
    });

    if (!book) {
      throw new CustomError(400, 'Book not found.', NOT_FOUND_ERROR);
    }

    return book;
  }

  async findAllBooks({
    page,
    limit,
    filters,
    userFilters
  }) {

    const result = await this.Book.findAndCountAll({
      where: { 
        [Op.and]: filters 
      },
      include:[
          {
           model:this.User,
           where:userFilters
          }
        ],
       order: [
        ['created_at', 'DESC'],
      ],
      ...paginate({ page, limit }),
    });

    return result;
  }
}

module.exports = BookService;
