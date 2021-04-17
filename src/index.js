
const express = require('express')
const app = express()
const morgan = require('morgan')
const port = 3000

const bodyParser = require('body-parser')
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
app.use(bodyParser.json())

//dev tool for debugging requests
app.use(morgan('dev'))

//Routes
// const AuthenticationRouter = require('./routes/authentication.routes')
const UsersRouter = require('./routes/users.routes')
const CurrenciesRouter = require('./routes/currencies.routes')

//Connect routes
// AuthenticationRouter.routesConfig(app)
UsersRouter.routesConfig(app)
CurrenciesRouter.routesConfig(app)

app.listen(port, () => {
  console.log(`Server on port: ${port}`)
})
