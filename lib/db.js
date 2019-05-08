const EventEmitter = require('events')
const mysql = require('promise-mysql')

class DB extends EventEmitter {
  constructor (config, logger) {
    super()

    this.logger = logger

    mysql.createConnection(config)
      .then((adapter) => {
        this.adapter = adapter

        this.emit('connection')
      })
      .catch(err => this.emit('error', err))
  }

  select (table, fields = [], wheres, order, direction, offset, limit) {
    let sql = `SELECT ${fields.join(', ')} \
                FROM ${table}`

    if (wheres) {
      sql += ` WHERE ${Object.keys(wheres).map((key) => `${key}=${typeof wheres[key] === 'string' && !wheres[key].includes('()') ? mysql.escape(wheres[key]) : wheres[key]}`).join(' AND ')}`
    }

    if (order && direction) {
      sql += ` ORDER BY ${order} ${direction}`
    }

    if (offset !== undefined && limit) {
      sql += ` LIMIT ${offset}, ${limit}`
    }

    return this.execute(sql)
  }

  execute (sql) {
    this.logger.debug(`Executing SQL query "${sql}"`)

    return this.adapter.query(sql)
  }
}

module.exports = DB
