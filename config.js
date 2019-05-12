module.exports = {
  logger: {
    level: process.env.LOG_LEVEL || 'debug'
  },
  db: {
    host: process.env.DB_HOST || '35.197.206.176',
    user: process.env.DB_USER || 'ssanalysis',
    password: process.env.DB_PASSWORD || 'E5m2QFccpqqu',
    database: process.env.DB_NAME || 'ssanalysis'
  },
  consumer: {
    projectId: process.env.CONSUMER_PROJECT_ID || 'subreddit-sentiment-analysis',
    subredditInsertedSubscriptionName: process.env.CONSUMER_SUBREDDIT_INSERTED_SUBSCRIPTION_NAME || 'subredditInsertsConsumer',
    subredditUpdatedSubscriptionName: process.env.CONSUMER_SUBREDDIT_UPDATED_SUBSCRIPTION_NAME || 'subredditUpdatesConsumer',
    averageComputedSubscriptionName: process.env.CONSUMER_AVERAGE_COMPUTED_SUBSCRIPTION_NAME || 'computedAveragesConsumer'
  }
}
