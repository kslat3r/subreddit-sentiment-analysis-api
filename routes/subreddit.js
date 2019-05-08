const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const label = require('../lib/label')

module.exports = (db, logger) => {
  router.get('/subreddits/:name', async (req, res, next) => {
    let rows

    try {
      rows = await db.select('scores', ['*'], {
        subreddit: req.params.name
      }, null, 'updated', 'asc')
    } catch (e) {
      next(createError(500, e.message))

      return
    }

    const out = {
      name: req.params.name,
      dates: rows.map(row => ({
        score: row.score,
        count: row.count,
        label: label(row.created),
        created: row.created,
        updated: row.updated
      }))
    }

    res.send(out)
  })

  return router
}
