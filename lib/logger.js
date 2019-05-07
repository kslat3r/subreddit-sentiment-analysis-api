const winston = require('winston')

class Logger {
  constructor (config) {
    this.adapter = winston.createLogger({
      level: config.level,
      format: winston.format.json(),
      transports: [
        new winston.transports.Console()
      ]
    })
  }

  log (msg) {
    this.adapter.log(msg)
  }

  debug (msg) {
    this.adapter.debug(msg)
  }

  info (msg) {
    this.adapter.info(msg)
  }

  warn (msg) {
    this.adapter.warn(msg)
  }

  error (msg) {
    this.adapter.error(msg)
  }
}

module.exports = Logger
