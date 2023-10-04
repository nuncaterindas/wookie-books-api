const BookRouter = require('./book-router');

class BookRoutes {
  constructor(router, services) {
    this.router = router;
    this.services = services;
  }

  register() {
    new BookRouter(this.router, this.services).routes();
    
    return this.router;
  }
}

module.exports = BookRoutes;
