const pool = require('../services/postgres.service')

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

exports.createUser = (req, res) => {
  const { name, email } = req.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, result) => {
    if (error) {
      throw error
    }

    res.status(200).json(`User added with ID: ${result.insertId}`)
  })
}

exports.updateUser = (req, res) =>  {
  const id = parseInt(req.params.id)
  const { name, email } = req.body

  pool.query('UPDATE users SET name = $1, email = $2, id = $3',
  [name, email, id],
  (error, result) => {
    if (error) {
      throw error
    }

    res.status(200).json(`User modified with ID: ${result}`)
  })
}

exports.deleteUserById = (req, res) =>  {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, result) => {
    if (error) {
      throw error
    }

    res.status(200).json(`User modified with ID: ${result}`)
  })
}