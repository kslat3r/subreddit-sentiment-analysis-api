process.env.TZ = 'UTC'

const config = require('./config')
const Logger = require('./lib/logger')
const DB = require('./lib/db')
const Consumer = require('./lib/consumer')
const express = require('express')
const cors = require('cors')
const expressWinston = require('express-winston')
const subredditsRouter = require('./routes/subreddits')
const subredditRouter = require('./routes/subreddit')
const createError = require('http-errors')
const http = require('http')
const socketIo = require('socket.io')

const logger = new Logger(config.logger)
const db = new DB(config.db, logger)
const consumer = new Consumer(config.consumer, logger)

db.on('connection', async () => {
  // setup express

  const app = express()

  app.use(cors())
  app.use(expressWinston.logger({ winstonInstance: logger.adapter }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  app.use('/api', subredditsRouter(db, logger))
  app.use('/api', subredditRouter(db, logger))

  app.use((req, res, next) => {
    next(createError(404))
  })

  app.use((err, req, res, next) => {
    res.send({ error: err.message })
  })

  // server

  const port = process.env.PORT || 3000
  app.set('port', port)

  const server = http.createServer(app)
  server.listen(port)

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    switch (error.code) {
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges')
        process.exit(1)

      case 'EADDRINUSE':
        logger.error(bind + ' is already in use')
        process.exit(1)

      default:
        throw error
    }
  })

  server.on('listening', () => {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port

    logger.debug('Listening on ' + bind)
  })

  // socket

  const io = socketIo(server)

  io.on('connection', (socket) => {
    consumer.on('subredditInserted', data => socket.emit('subredditInserted', data))
    consumer.on('subredditUpdated', data => socket.emit('subredditUpdated', data))
    consumer.on('averageComputed', data => socket.emit('averageComputed', data))
  })

  await consumer.start()
})

db.on('error', err => logger.error(err.message))
