const pool = require('../services/postgres.service')
const bcrypt = require('bcrypt')

exports.getUsers = (req, res) =>  {
  pool.query('SELECT * FROM users ORDER BY ID ASC', (error, results) => {
    if (error) {
      throw error
    }

    res.status(200).json(results.rows)
  })
}

exports.getUserById = (req, res) =>  {
  const id = parseInt(req.params.id)
  pool.query('SELECT * FROM users WHERE id=$1', [id], (error, results) => {
    if (error) {
      throw error
    }

    res.status(200).json(results.rows)
  })
}

exports.createUser = async (req, res) => {
  //cifrar contraseña
  console.log(req.body)
  const hashedPassword = await bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword
  
  const { name, email, password } = req.body

  pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name',
    [name, email, password],
    (error, result) => {
    if (error) {
      throw error
    }
    res.status(200).json(`User ${ result.rows[0].name} added with ID: ${result.rows[0].id}`)
  })
}

exports.updateUser = async (req, res) =>  {
  const id = parseInt(req.params.id)
  const hashedPassword = await bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword
  const { name, email, password } = req.body

  pool.query('UPDATE users SET name = $1, email = $2, password = $3 where id = $4 RETURNING id, name',
  [name, email, password, id],
  (error, result) => {
    if (error) {
      throw error
    }

    res.status(200).json(`User ${ result.rows[0].name} modified with ID: ${result.rows[0].id}`)
  })
}

exports.deleteUserById = (req, res) =>  {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM users WHERE id = $1 RETURNING id, name', [id], (error, result) => {
    if (error) {
      throw error
    }
    console.log(result.rows)
    res.status(200).json(`User ${ result.rows[0].name} with ID: ${result.rows[0].id} deleted successfully`)
  })
}