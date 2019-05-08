const express = require('express')
const router = express.Router()

module.exports = (db, logger) => {
  router.get('/subreddits', async (req, res) => {
    const subreddits = await db.select('scores', ['subreddit'], {
      subreddit: 'AskReddit'
    }, 'subreddit', 'updated', 'asc')

    res.send(subreddits)
  })

  return router
}
