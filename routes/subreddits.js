const express = require('express')
const router = express.Router()
const createError = require('http-errors')

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
        dates = await db.execute(`select id, scoreSum / count as average, subredditId, created from (select id, sum(score) as scoreSum, count(*) as count, subredditId, created from scores where subredditId = "${subreddit.id}" group by date(created) order by date(created) asc) as average`)
      } catch (e) {
        next(createError(500, e.message))

        return
      }

      subreddit.dates = dates
    }

    res.send(subreddits)
  })

  return router
}
