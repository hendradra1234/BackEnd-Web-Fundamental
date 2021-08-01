const amqp = require('amqplib')

const ProducerService = {
  sendQueue: async (queue, message/* , listener */) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
    const channel = await connection.createChannel()
    const Message = JSON.stringify(message)
    await channel.assertQueue(queue, {
      durable: true
    })

    await channel.sendToQueue(queue, Buffer.from(Message))

    // Sending Email Disable, Consumer mengunakan aplikasi terpisah
    // await channel.consume(queue, listener.listenData, { noAck: true })
    setTimeout(() => {
      connection.close()
    }, 1000)
  }
}

module.exports = ProducerService
