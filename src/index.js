
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

app.listen(port, () => {
  console.log(`Server on port: ${port}`)
})
