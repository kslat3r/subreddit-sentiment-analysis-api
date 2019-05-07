const express = require('express')
const router = express.Router()

module.exports = (db, logger) => {
  router.get('/subreddits/:name', (req, res) => {
    res.send({ title: `Subreddit ${req.params.name}` })
  })

  return router
}
