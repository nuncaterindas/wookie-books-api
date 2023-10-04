/* eslint-disable no-underscore-dangle */

const _ = require('lodash');
const Joi = require('joi');
const Schemas = require('../schemas');
const errorCode = require('../enums/error-codes');

const has = (route) => {
  const schemaRoutes = _.map(Schemas, (value, prop) => prop);
  const result = _.filter(schemaRoutes, (schema) => {
    const reg = new RegExp(schema, 'i');

    return reg.test(route);
  });

  return result[0];
};

module.exports = () => {
  // enabled HTTP methods for request data validation
  const _supportedMethods = ['post', 'put'];

  // Joi validation options
  const _validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true, // remove unknown keys from the validated data
  };

  // return the validation middleware
  // eslint-disable-next-line consistent-return
  return (req, res, next) => {
    const route = has(req.path);
    const method = req.method.toLowerCase();

    if (_.includes(_supportedMethods, method) && route) {
      // get schema for the current route
      const _schema = _.get(Schemas, route);

      if (_schema) {
        // Validate req.body using the schema and validation options
        return Joi.validate(req.body, _schema, _validationOptions, (err, data) => {
          if (err) {
            const errors = _.map(err.details, ({ message }) => message.replace(/['"]/g, ''));

            // Send back the JSON error response
            res.status(400).send({
              code: errorCode.VALIDATION_ERROR,
              error: errors[0], // return only the first error
            });
          } else {
            // Replace req.body with the data after Joi validation
            req.body = data;
            next();
          }
        });
      }
    }

    next();
  };
};

/* eslint-enable no-underscore-dangle */
