const Pool = require('pg').Pool

pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'currencies',
  password: 'password',
  port: 5432
})

module.exports = pool