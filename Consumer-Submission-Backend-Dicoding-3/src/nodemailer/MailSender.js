const nodemailer = require('nodemailer')

class senderMail {
  constructor () {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'login',
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
      }
    })
  }

  send (targetEmail, data) {
    const Data = JSON.stringify(data)
    try {
      const message = {
        from: `"Submission Dicoding Backend Fundamental Final" <${process.env.MAIL_ADDRESS}>`,
        to: `${targetEmail}`,
        subject: 'Sending the Message Broker data',
        text: 'Result of Export Playlist Songs Data',
        attachments: [ // JSON data
          {
            filename: 'playlistSongsData.json',
            content: Data
          }
        ]
      }

      const result = this._transporter.sendMail(message)

      console.log('Sending Email Success')
      return result
    } catch (error) {
      console.log(error.message)
    }
  }
}
module.exports = senderMail
