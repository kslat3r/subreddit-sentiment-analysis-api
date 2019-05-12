const EventEmitter = require('events')
const { PubSub } = require('@google-cloud/pubsub')

class Consumer extends EventEmitter {
  constructor (config, logger) {
    super()

    this.pubSub = new PubSub()
    this.subredditInsertedSubscriptionName = config.subredditInsertedSubscriptionName
    this.subredditUpdatedSubscriptionName = config.subredditUpdatedSubscriptionName
    this.averageComputedSubscriptionName = config.averageComputedSubscriptionName
    this.logger = logger
  }

  subscribe (subscription) {
    this.logger.debug(`Creating subscription to subscription "${subscription}"`)

    return this.pubSub.subscription(subscription)
  }

  messageHandler (event) {
    return (message) => {
      const data = JSON.parse(Buffer.from(message.data))

      this.logger.debug(`Received message for event ${event}`)
      this.emit(event, data)

      message.ack()
    }
  }

  async start () {
    let subredditInsertedSubscription
    let subredditUpdatedSubscription
    let averagedComputedSubscription

    try {
      // subredditInsertedSubscription = await this.subscribe(this.subredditInsertedSubscriptionName)
      // subredditUpdatedSubscription = await this.subscribe(this.subredditUpdatedSubscriptionName)
      averagedComputedSubscription = await this.subscribe(this.averageComputedSubscriptionName)
    } catch (e) {
      this.logger.error(e)
    }

    if (subredditInsertedSubscription) {
      subredditInsertedSubscription.on('message', this.messageHandler('subredditInserted'))
    }

    if (subredditUpdatedSubscription) {
      subredditUpdatedSubscription.on('message', this.messageHandler('subredditUpdated'))
    }

    if (averagedComputedSubscription) {
      averagedComputedSubscription.on('message', this.messageHandler('averageComputed'))
    }
  }
}

module.exports = Consumer
