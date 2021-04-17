const userController = require('../controllers/users.controller')

exports.routesConfig = (app)  => {

  app.get('/api/users', userController.getUsers)
  app.get('/api/users/:id', userController.getUserById)
  app.post('/api/users', userController.createUser)
  app.put('/api/users/:id', userController.updateUser)
  app.delete('/api/users/:id', userController.deleteUserById)
  
  }