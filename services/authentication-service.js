const sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const UIDGenerator = require('uid-generator');
const stringSimilarity = require('string-similarity');
const {
  JWT_SECRET,
  TOKENS_TTL,
} = require('../config');
const CustomError = require('../helpers/custom-error');
const { addDays } = require('../helpers/date-helpers');
const { VALIDATION_ERROR, AUTHORIZATION_ERROR, NOT_FOUND_ERROR } = require('../enums/error-codes');
const userType = require('../enums/user-types');

const { Op } = sequelize;
const uidgen = new UIDGenerator(256);// 256 bitsize

class AuthenticationService {
  constructor(database) {
    this.database = database;
    this.sequelize = this.database.sequelize;

    Object.assign(this, this.database.models);
  }

  /**
   * Generate Access Tokens
   */
  async generateTokens(userId, {
    as = userType.AUTHOR,
    isRefresh = false,
    access = null,
    status = false,
    authorPseudonym = null
  } = {}) {
    const payload = {
      as,
      id: userId,
      type: 'access_token',
      status,
    };

    if (access) {
      payload.access = access;
    }

    if (authorPseudonym) {
      payload.authorPseudonym = authorPseudonym;
    }

    // Access Token
    const accessToken = await jwt.sign(payload, JWT_SECRET, { expiresIn: TOKENS_TTL.access_token });

    // If just a refresh and not a login
    if (isRefresh) {
      return accessToken;
    }

    // Refresh Token
    const refreshToken = await uidgen.generate();
    const today = new Date();
    const expiryDate = addDays(today, TOKENS_TTL.refresh_token);
    // Save Refresh Token on database
    const tokenObject = await this.RefreshToken.create({
      token: refreshToken,
      user_id: userId,
      is_valid: true,
      expires_at: expiryDate,
    });

    if (tokenObject) {
      return {
        accessToken,
        refreshToken,
      };
    }
  }


  /**
   * Check if user with username exists
   */
   async validateUsername(username) {
    const user = await this.User.findOne({
      where: { username },
    });

    if (user) {
      throw new CustomError(409, 'Username is already taken', VALIDATION_ERROR);
    }
  }

   /**
   * Check if user with pseudonym exists
   */
    async validatePseudonym(authorPseudonym) {
      const user = await this.User.findOne({
        where: { author_pseudonym : authorPseudonym },
      });
  
      if (user) {
        throw new CustomError(409, 'Author Pseudonym is already taken', VALIDATION_ERROR);
      }
    }


  async getUser({username}) {
    const user = await this.User.findOne({
      where: { username },
    });
    
    return user;
  }

  /**
   * Signup
   */
async create({
    username,
    password,
    authorPseudonym,
   }) {
     // Validate if username is already taken
     await this.validateUsername(username);

    // Validate if author_pseudonym is already taken
     await this.validatePseudonym(authorPseudonym)

     // Create new user
     const user = await this.User.create({
      username,
      password,
      author_pseudonym : authorPseudonym,
     });
     
     return this.getUserById(user.id);
   }





async update({
    userId,
    data,
  }) {
    // Check if user exists
    const user = await this.User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new CustomError(404, 'User profile not found.');
    }

    if (data && data.password) {
      user.setPassword(data.password);
      await user.save();

      // eslint-disable-next-line no-param-reassign
      delete data.password;
    }

    try {
      await user.update({
        ...data,
      });
    } catch (error) {
      if (error instanceof Sequelize.UniqueConstraintError) {
        throw new CustomError(400, 'Username is already taken.', VALIDATION_ERROR);
      }

      throw error;
    }

    return this.getUserById(user.id);
  }

  
  async signIn({
    username,
    password,
  }) {
  
    const user = await this.getUser({ username });

    if (!user) {
      throw new CustomError(401, 'Invalid user credentials', VALIDATION_ERROR);
    }

    // Check for deleted account
    if (!user.status) {
      throw new CustomError(401, 'Invalid user credentials', VALIDATION_ERROR);
    }

    if (user.validPassword(password)) {
      return user;
    }

    throw new CustomError(401, 'Invalid user credentials', VALIDATION_ERROR);
  }

  async refreshAccessToken({ accessToken, refreshToken }) {
    // Return Unauthorized if token is not provided
    if (!accessToken) {
      throw new CustomError(401, ['No access token provided']);
    }

    // verifies secret and checks exp
    try {
      const decoded = jwt.verify(accessToken, JWT_SECRET, { ignoreExpiration: true });
      const {
        id: userId, as, access,
      } = decoded;
      const tokenObject = await this.RefreshToken.findOne({
        where: {
          token: refreshToken,
          user_id: userId,
          is_valid: true,
          expires_at: {
            [Op.gt]: Date.now(),
          },
        },
      });

      if (!tokenObject) {
        throw new CustomError(403, 'Refresh token is either invalid or has expired', VALIDATION_ERROR);
      }

      // add refresh count
      const refreshCount = tokenObject.refresh_count;
      tokenObject.refresh_count = refreshCount + 1;
      await tokenObject.save();

      // create new access tokens
      const newAccessToken = await this.generateTokens(userId, { as, access, isRefresh: true });

      return newAccessToken;
    } catch (err) {
      // check if error produced is from jwt
      if (err.name === 'JsonWebTokenError') {
        throw new CustomError(403, 'Bearer token is either invalid or has expired', AUTHORIZATION_ERROR);
      }

      throw (err);
    }
  }

  async changePassword({
    userId,
    current_password: currentPassword,
    new_password: newPassword,
    confirm_password: confirmPassword,
  }) {
    // Validate new passwords if same
    if (newPassword !== confirmPassword) {
      throw new CustomError(400, 'Passwords do not match', VALIDATION_ERROR);
    }
    // Fetch user object
    const user = await this.User.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new CustomError(404, 'User not found.', NOT_FOUND_ERROR);
    }

    // Validate user password
    if (user.validPassword(currentPassword)) {
      // Check if password is too similar to current one
      if (stringSimilarity.compareTwoStrings(currentPassword, newPassword) > 0.65) {
        throw new CustomError(400, 'New password too similar to current password', VALIDATION_ERROR);
      }
      user.setPassword(newPassword);
      await user.save();
      return true;
    }

    throw new CustomError(400, 'current_password is invalid', VALIDATION_ERROR);
  }

  async getUserById(id) {
    const user = await this.User.findOne({
      where: { id },
      attributes: {
        exclude: [
          'password',
          'created_at',
          'updated_at',
        ],
      },
    });

    if (!user) {
      throw new CustomError(404, 'User not found.', NOT_FOUND_ERROR);
    }

    return user;
  }

  async delete(userId) {

    const user = await this.getUserById(userId)

    await user.destroy()
  }

}

module.exports = AuthenticationService;
