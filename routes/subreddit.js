const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const dateMapper = require('../lib/date-mapper')

module.exports = (db, logger) => {
  router.get('/subreddits/:name', async (req, res, next) => {
    let subreddits

    try {
      subreddits = await db.select('subreddits', ['*'], { name: req.params.name })
    } catch (e) {
      next(createError(500, e.message))

      return
    }

    if (!subreddits.length) {
      next(createError(404, 'Not found'))

      return
    }

    const subreddit = subreddits[0]
    let dates = []

    try {
      dates = await db.select('dailyScores', ['*'], { subredditId: subreddit.id }, 'DATE(created)', 'DESC')
    } catch (e) {
      next(createError(500, e.message))

      return
    }

    subreddit.dates = dateMapper(dates)

    res.send(subreddit)
  })

  return router
}
