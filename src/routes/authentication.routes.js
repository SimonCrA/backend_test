const authenticationController = require('../controllers/authentication.controller')

exports.routesConfig = (app)  => {

  app.post('api/signup', authenticationController.singUp)
  app.post('api/login', authenticationController.logIn)

}