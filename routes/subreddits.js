const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const dateMapper = require('../lib/date-mapper')

module.exports = (db, logger) => {
  router.get('/subreddits', async (req, res, next) => {
    let subreddits

    try {
      subreddits = await db.select('subreddits', ['*'], null, 'count', 'desc', req.query.offset || 0, 20)
    } catch (e) {
      next(createError(500, e.message))

      return
    }

    for (const subreddit of subreddits) {
      let dates = []

      try {
        dates = await db.select('dailyScores', ['*'], { subredditId: subreddit.id }, 'DATE(created)', 'DESC')
      } catch (e) {
        next(createError(500, e.message))

        return
      }

      subreddit.dates = dateMapper(dates)
    }

    res.send(subreddits)
  })

  return router
}
