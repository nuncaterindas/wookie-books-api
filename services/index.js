const Authentication = require('./authentication-service');
const Book = require('./book-service');

class Service {
  constructor(database) {
    this.database = database;
  }

  register() {
    return {
      auth: new Authentication(this.database),
      book: new Book(this.database),
    };
  }
}

module.exports = Service;
