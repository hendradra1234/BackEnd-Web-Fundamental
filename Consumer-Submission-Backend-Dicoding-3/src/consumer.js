require('dotenv').config()

const amqp = require('amqplib')
const MusicService = require('./posgres/OpenMusicServices')
const MailSender = require('./nodemailer/MailSender')
const Listener = require('./nodemailer/listener')
const cacheService = require('./posgres/redis/CacheService')

const init = async () => {
  try {
    const queue = 'export:songsDataExports'
    const musicService = new MusicService(cacheService)
    const mailSender = new MailSender()
    const listener = new Listener(musicService, mailSender)
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
    const channel = await connection.createChannel()

    await channel.assertQueue(queue, {
      durable: true
    })

    channel.consume(queue, listener.listenData, { noAck: true })

    console.log(`Running Customer at User: <${process.env.MAIL_ADDRESS}>`)
    console.log('CTRL+C to stop the Console')
    console.log('Listening For Queue....')
  } catch (error) {
    console.log(error)
  }
}

init()
