module.exports = {
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  },
  db: {
    host: process.env.DB_HOST || '35.197.206.176',
    user: process.env.DB_USER || 'ssanalysis',
    password: process.env.DB_PASSWORD || 'E5m2QFccpqqu',
    database: process.env.DB_NAME || 'ssanalysis'
  }
}
