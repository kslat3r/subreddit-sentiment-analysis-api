const express = require('express')
const router = express.Router()

module.exports = (db, logger) => {
  router.get('/subreddits', (req, res) => {
    res.send({ title: 'Subreddits' })
  })

  return router
}
