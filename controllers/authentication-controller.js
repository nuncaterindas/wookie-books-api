const userType = require('../enums/user-types');

class AuthenticationController {
  constructor(services) {
    this.services = services;
  }

/**
 * Registers a new user in the system and returns the access token..
 *
 * @param {string} username - The desired username for the new user.
 * @param {string} password - The password chosen by the new user.
 * @param {string} author_pseudonym - The pseudonym or chosen name of the new user.
 * @returns {Promise} A promise that resolves to an access token upon successful registration.
 * @throws {Error} If the registration fails due to an invalid input or a database error.
 *
 */
  async signUp(req, res) {
    const { 
      body:{
        username,
        password,
        author_pseudonym:authorPseudonym,
      }
       } = req;

    // Create new user
    const user = await this.services.auth.create({
      username,
      password,
      authorPseudonym
    });

    if(!user){
      return res.status(400).send({
        message: 'Something went wrong',
      });
    }

   
    // Generate access_token and refresh_token
    const { accessToken, refreshToken } = await this.services.auth.generateTokens(
      user.id,
      { 
        as: userType.AUTHOR,
        status:user.status,
        authorPseudonym: user.author_pseudonym
      },
    );

    return res.status(201).send({
      message: 'Signup successful!',
      results: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  }




  /**
 * Sign-in registered account.
 *
 * @param {string} username - Registered username.
 * @param {string} password - Registered password.
 * @returns {Promise} A promise that resolves to an access token upon successful authentication.
 * @throws {Error} If the authentication fails due to an invalid input or a database error.
 *
 */
  async signIn(req, res) {

    const user = await this.services.auth.signIn(req.body);

    // Generate access_token and refresh_token
    const { accessToken, refreshToken } = await this.services.auth.generateTokens(
      user.id,
      { as: userType.USER ,
        status:user.status,
        authorPseudonym: user.author_pseudonym
      },
    );

    return res.status(200).send({
      message: 'Login successful!',
      results: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  }

  


   /**
 * Registers a new user in the system and returns the access token..
 *
 * @param {string} token - access token.
 * @param {string} refresh_token - refresh token.
 * @returns {Promise} A promise that resolves to an access token upon successful authentication.
 * @throws {Error} If the authentication fails due to an invalid input or a database error.
 *
 */
  async refreshToken(req, res) {
    const { token: accessToken, body: { refresh_token: refreshToken } } = req;

    // Generate access_token
    const newAccessToken = await this.services.auth.refreshAccessToken({
      accessToken,
      refreshToken,
    });

    res.status(200).send({
      message: 'Refresh token successful!',
      results: {
        access_token: newAccessToken,
      },
    });
  }



/**
 * Registers a new user in the system and returns the access token..
 *
 * @param {string} current_password - current password to be changed.
 * @param {string} new_password - new password.
 * @param {string} confirm_password - confirm password.
 * @returns {Object} A object with message.
 * @throws {Error} If the authentication fails due to an invalid input or a database error.
 *
 */
  async changePassword(req, res) {
    const { body, user: { id: userId } } = req;

    await this.services.auth.changePassword({ userId, ...body });

    res.status(200).send({
      message: 'Password updated successfully!',
    });
  }

  
/**
 * Update/Edit own profile.
 *
 * @param {string} username - The desired new username.
 * @param {string} author_pseudonym - The desired new author_pseudonym.
 * @returns {Object} A object of updated user.
 * @throws {Error} If the registration fails due to an invalid input or a database error.
 *
 */
  async updateProfile(req, res) {
    const { 
      user:{ 
        id : userId
       }, 
      body } = req;

    const updateProfile = await this.services.auth.update({
      userId,
      data: { ...body },
    });

    res.status(200).send({
      message: 'Updated successfully!',
      results: updateProfile,
    });
  }

  /**
 * Delete own account.
 *
 * @param {Number} userId - User account id.
 * @returns {Mesage} Return a message and status.
 * @throws {Error} If the process fails due to an invalid input or a database error.
 *
 */
  async deleteAccount(req, res) {
    const { 
      user:{ 
        id : userId
       }, 
      } = req;


  await this.services.auth.delete(userId);

    res.status(200).send({
      message: 'Success!',
    });
  }
  
}

module.exports = AuthenticationController;
