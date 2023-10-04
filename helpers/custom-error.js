const errorCodes = require('../enums/error-codes');

// Global Error Handler
class CustomError extends Error {
  constructor(status, error, code = errorCodes.UNKNOWN_ERROR) {
    super();

    this.status = status;
    this.error = error;
    this.code = code;
  }
}

module.exports = CustomError;
