const BookController = require('../../controllers/public/book-controller');

class BookRouter {
  constructor(router, services) {
    this.router = router;
    this.book = new BookController(services);
  }

  routes() {

    this.router
      .get('/books',async (req, res) => this.book.getList(req, res));

    this.router
      .get('/book/:id', async (req, res) => this.book.getBook(req, res));
  }
}

module.exports = BookRouter;
