module.exports = {
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'ssanalysis',
    password: process.env.DB_PASSWORD || 'S-mE{xVgn%h69}n!',
    database: process.env.DB_NAME || 'ssanalysis'
  }
}
