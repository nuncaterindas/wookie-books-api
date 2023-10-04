const Sequelize = require('sequelize');
const { getNextPage } = require('../../helpers/paginate');

const { Op } = Sequelize;



const serializeBook = async (book) => {
  const author = await book.getUser()
  return  {
    id:book.id,
    title:book.title,
    description:book.description,
    cover_image:book.cover_image,
    price:book.id,
    author:author.author_pseudonym || null
  }
}


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


const getUserFilters = ({
  author
}) => {
  const filters = [];

  if (author) {
    filters.push({
      author_pseudonym: { [Op.like]: `%${author}%` },
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
 * @returns {Object} Serialized book object.
 *
 */
 async getBook(req, res) {
  const { 
     params:{
      id:bookId
     }
    } = req;
  
  const book = await this.services.book.findById({
    bookId
  });

  const results = await serializeBook(book)

  res
  .status(200)
  .send({
    message: 'Success!',
    results
  });
}



/**
 * Asynchronous function to fetch all books published.
 *
 * @param {string} [req.query.title] - Optional. Filter by title to narrow down the book list.
 * @param {string} [req.query.description] - Optional. Filter by description to narrow down the book list.
 * @param {string} [req.query.price] - Optional. Filter by price to narrow down the book list.
 * @param {string} [req.query.author] - Optional. Filter by author to narrow down the book list.
 * @param {number} [req.query.page] - Optional. The page number for paginated results (default is 1).
 * @param {number} [req.query.limit] - Optional. The number of results per page (default is 20).
 * @returns {Object} Serialized books object.
 *
 */
 async getList(req, res) {
  const { 
     query:{
      title,
      description,
      price,
      author,
      page,
      limit
     }
     } = req;


  const filters = getFilters({
    title,
    description,
    price,
    });

  const userFilters = getUserFilters({author})

  const { count, rows } = await this.services.book.findAllBooks({
    filters,
    userFilters,
    page,
    limit
  });

  const results = await serializeBooks(rows)

  res
  .status(200)
  .send({
    message: 'Success!',
    count,
    next: getNextPage({ page, count, limit }),
    results
  });
}

  
}

module.exports = BookController;
