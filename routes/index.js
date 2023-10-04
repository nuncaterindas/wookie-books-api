const AuthenticationRouter = require('./authentication-router');
const BookPublicRouter = require('./public/book-router');

class Routes {
  constructor(router, services) {
    this.router = router;
    this.services = services;
  }

  register() {
    new AuthenticationRouter(this.router, this.services).routes();
    new BookPublicRouter(this.router, this.services).routes();
    
    return this.router;
  }
}

module.exports = Routes;
