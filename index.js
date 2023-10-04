const express = require('express');
const bearerToken = require('express-bearer-token');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

require('express-async-errors');

const {
  PORT,
  UNAUTHED_ROUTES,
} = require('./config');
const { isAuthor } = require('./middlewares/acl-middleware');
const { sequelize, models } = require('./database');
const Services = require('./services');
const Routes = require('./routes');
const AuthorRoutes = require('./routes/author');
const handleError = require('./middlewares/error-handler-middleware');
const authRequired = require('./middlewares/authentication-middleware');
const SchemaValidator = require('./middlewares/schema-validator-middleware');

const services = new Services({ sequelize, models }).register();
const routes = new Routes(express.Router(), services).register();
const adminRoutes = new AuthorRoutes(express.Router(), services).register();


const validateSchema = SchemaValidator();

const startServer = () => {
  const app = express();

  app.use(morgan('tiny'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(bearerToken());
  app.use(cors());

  // Enforce authentication EXCEPT for these routes
  app.use(
    authRequired.unless({
      path: UNAUTHED_ROUTES,
    }),
  );

  // SchemaValidator
  app.use(validateSchema);

  // Mount all API related routes
  app.use('/api', routes);

  // Admin Routes
  app.use('/api/authors', isAuthor, adminRoutes);

  // Capture thrown Errors
  app.use((err, req, res, next) => {
    handleError(err, res, next);
    next();
  });

  return app;
};


module.exports = startServer;
