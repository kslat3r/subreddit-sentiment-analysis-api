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

  select (table, fields = [], wheres = {}) {
    const sql = `SELECT ${fields.join(', ')} \
                FROM ${table} \
                WHERE ${Object.keys(wheres).map((key) => `${key}=${!wheres[key].includes('()') ? mysql.escape(wheres[key]) : wheres[key]}`).join(' AND ')}`

    return this.execute(sql)
  }

  count (table, wheres = {}) {
    const sql = `SELECT COUNT (id) AS count \
                FROM ${table} \
                WHERE ${Object.keys(wheres).map((key) => `${key}=${mysql.escape(wheres[key])}`).join(' AND ')}`

    return this.execute(sql)
  }

  insert (table, data = {}) {
    const sql = `INSERT INTO ${table} (${Object.keys(data).join(', ')}) \
                VALUES (${Object.values(data).map(val => mysql.escape(val)).join(', ')})`

    return this.execute(sql)
  }

  update (table, data, wheres = {}) {
    const sql = `UPDATE ${table} \
                SET ${Object.keys(data).map((key) => `${key}=${mysql.escape(data[key])}`).join(', ')} \
                WHERE ${Object.keys(wheres).map((key) => `${key}=${mysql.escape(wheres[key])}`).join(' AND ')}`

    return this.execute(sql)
  }

  delete (table, wheres = {}) {
    const sql = `DELETE FROM ${table} \
                WHERE ${Object.keys(wheres).map((key) => `${key}=${mysql.escape(wheres[key])}`).join(' AND ')}`

    return this.execute(sql)
  }

  execute (sql) {
    this.logger.debug(`Executing SQL query "${sql}"`)

    return this.adapter.query(sql)
  }
}

module.exports = DB
