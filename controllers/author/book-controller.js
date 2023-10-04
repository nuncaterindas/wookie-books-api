const Sequelize = require('sequelize');
const { getNextPage } = require('../../helpers/paginate');

const { Op } = Sequelize;



const serializeBook = (book) =>({
    id:book.id,
    title:book.title,
    description:book.description,
    cover_image:book.cover_image,
    price:book.id,
    user_id:book.user_id
})


const serializeBooks = async(books) => {
  return Promise.all(books.map(
    (book) => serializeBook(book),
  ));
}

const getFilters = ({
  title,
  description,
  price,
}) => {
  const filters = [];

  if (title) {
    filters.push({
      title: { [Op.like]: `%${title}%` },
    });
  }

  if (description) {
    filters.push(
      {
        description: { [Op.like]: `%${description}%` },
      },
    );
  }

  if (price) {
    filters.push({
      price : parseFloat(price)
    });
  }

  return filters;
};

class BookController {
  constructor(services) {
    this.services = services;
  }

/**
 * Asynchronous function to fetch a book by its ID.
 *
 * @param {string} bookId - The unique identifier of the book to be fetched.
 * @param {string} userId - The request should contain the user's ID to ensure only the book's author can access it.
 * @returns {Object} Serialized book object.
 *
 */
 async getBook(req, res) {
  const { 
    user:{ 
      id : userId
     },
     params:{
      id:bookId
     }
    } = req;
  
  const filters = [];

  //FILTER FOR TO MAKE SURE THE AUTHOR CAN ONLY FETCH OWN BOOK
  filters.push(
    {
    user_id: userId
  })

  const book = await this.services.book.findById({
    filters,
    bookId
  });

  
  const results = serializeBook(book)

  res.send({
    message: 'Success!',
    results
  });
}


/**
 * Asynchronous function to fetch all books published by logged-in user.
 *
 * @param {string} req.query.userId - The ID of the user making the request to ensure only the book's author can access it.
 * @param {string} [req.query.title] - Optional. Filter by title to narrow down the book list.
 * @param {string} [req.query.description] - Optional. Filter by description to narrow down the book list.
 * @param {string} [req.query.price] - Optional. Filter by price to narrow down the book list.
 * @param {number} [req.query.page] - Optional. The page number for paginated results (default is 1).
 * @param {number} [req.query.limit] - Optional. The number of results per page (default is 20).
 * @returns {Object} Serialized books object.
 *
 */
 async getList(req, res) {
  const { 
    user:{ 
      id :userId
     },
     query:{
      title,
      description,
      price,
      page,
      limit
     }
     } = req;

  const filters = getFilters({
    title,
    description,
    price,
    });

  //Get List of Own Book
  filters.push(
    {
      user_id:userId
    }
  )

  const { count, rows } = await this.services.book.findAll({
    filters,
    page,
    limit
  });

  
  const results = await serializeBooks(rows)

  res.send({
    message: 'Success!',
    count,
    next: getNextPage({ page, count, limit }),
    results
  });
}



/**
 * Asynchronous function to publish book by logged-in user.
 *
 * @param {string} req.query.userId - The ID of the user making the request to ensure only the book's author can access it.
 * @param {string} title - Required. Book's title.
 * @param {string} description - Required. Book's description.
 * @param {string} cover_image - Optional. Required. Book's cover image.
 * @param {number} price - Required. Book's price.
 * @returns {Object} Serialized books object.
 *
 */
  async publishBook(req, res) {
    const { 
      user:{ id :userId },
      body:{
        title,
        description,
        cover_image,
        price
      }
       } = req;

    // Publish Book
    const book = await this.services.book.create({
        title,
        description,
        cover_image,
        price,
        user_id:userId
    });

    if(!book){
      return res.status(400).send({
        message: 'Something went wrong',
      });
    }

    const results = serializeBook(book)

    return res.status(201).send({
      message: 'Success!',
      results,
    });

  }


  /**
 * Asynchronous function to update published book by authorized user.
 *
 * @param {string} req.query.userId - The ID of the user making the request to ensure only the book's author can access it.
 * @param {string} title - Required. Book's title.
 * @param {string} description - Required. Book's description.
 * @param {string} cover_image - Optional. Required. Book's cover image.
 * @param {number} price - Required. Book's price.
 * @returns {Object} Serialized books object.
 *
 */
  async updateBook(req, res) {
    const { 
      user:{ id : userId },
      params:{ id: bookId },
      body
       } = req;

    const data = { ...body }

    const book = await this.services.book.update({
      userId,
      bookId,
      data
    });

    const results = serializeBook(book)

    return res.status(201).send({
      message: 'Success!',
      results,
    });

  }



  /**
 * Asynchronous function to delete published book by authorized user.
 *
 * @param {string} req.query.userId - The ID of the user making the request to ensure only the book's author can access it.
 * @param {string} title - Required. Book's title.
 * @param {string} description - Required. Book's description.
 * @param {string} cover_image - Optional. Required. Book's cover image.
 * @param {number} price - Required. Book's price.
 * @returns {Object} Serialized books object.
 *
 */
  async deleteBook(req, res) {
    const { 
      user:{ id : userId },
      params:{ id: bookId },
       } = req;

   await this.services.book.delete({
      userId,
      bookId,
    });

    return res.status(201).send({
      message: 'Success!',
    });

  }
  
}

module.exports = BookController;
