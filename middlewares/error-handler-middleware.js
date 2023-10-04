const { SERVER_ERROR } = require('../enums/error-codes');

// Captures the error when thrown
module.exports = (err, res) => {
  const { status, error, code } = err;

  // Send Internal Server Error if error is unknown
  if (!status) {
    res.status(500).send({
      code: SERVER_ERROR,
      error: 'Internal server error. Please contact administrator immediately',
    });

    // log unknown err
    console.error(err); // eslint-disable-line no-console
  } else {
    res.status(status).send({
      code,
      error,
    });
  }
};
