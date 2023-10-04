const AuthenticationController = require('../controllers/authentication-controller');

class AuthenticationRouter {
  constructor(router, services) {
    this.router = router;
    this.auth = new AuthenticationController(services);
  }

  routes() {
    this.router
      .post('/signup', async (req, res) => this.auth.signUp(req, res));

    this.router
      .post('/signin', async (req, res) => this.auth.signIn(req, res));

    this.router
      .post('/refresh_token', async (req, res) => this.auth.refreshToken(req, res));
 
    this.router
      .put('/change_password', async (req, res) => this.auth.changePassword(req, res));

    this.router
      .put('/update_profile', async (req, res) => this.auth.updateProfile(req, res));

    this.router
      .delete('/delete_account', async (req, res) => this.auth.deleteAccount(req, res));
  }
}

module.exports = AuthenticationRouter;
