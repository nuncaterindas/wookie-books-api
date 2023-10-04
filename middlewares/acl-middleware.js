const CustomError = require('../helpers/custom-error');
const {
  AUTHORIZATION_ERROR,
} = require('../enums/error-codes');
const userTypes = require('../enums/user-types');

const isAuthor = (req, res, next) => {
  const { user } = req;

  if (user.as === userTypes.AUTHOR) {
    next();
  } else {
    throw new CustomError(403, 'You don\'t have enough permission to access resource.', AUTHORIZATION_ERROR);
  }
};

const restrictUser = (req, res, next) => {
  const { user } = req;
  if (user.as === userTypes.AUTHOR) {

  if (user.authorPseudonym === "Darth Vader" ||  user.authorPseudonym === "_Darth Vader_") {
    throw new CustomError(403, 'You don\'t have enough permission to access resource.', AUTHORIZATION_ERROR);
  } 

  next();

}else {
    throw new CustomError(403, 'You don\'t have enough permission to access resource.', AUTHORIZATION_ERROR);
  }
};

module.exports = {
  isAuthor,
  restrictUser
};
