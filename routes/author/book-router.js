const BookController = require('../../controllers/author/book-controller');
const { isAuthor, restrictUser } = require('../../middlewares/acl-middleware');

class BookRouter {
  constructor(router, services) {
    this.router = router;
    this.book = new BookController(services);
  }

  routes() {
    this.router
      .post('/publish', restrictUser, async (req, res) => this.book.publishBook(req, res));

    this.router
      .get('/books', isAuthor,async (req, res) => this.book.getList(req, res));

    this.router
      .get('/book/:id', isAuthor, async (req, res) => this.book.getBook(req, res));

    this.router
      .put('/book/:id', isAuthor, async (req, res) => this.book.updateBook(req, res));

    this.router
      .delete('/unpublish/:id', isAuthor, async (req, res) => this.book.deleteBook(req, res));
  }
}

module.exports = BookRouter;
