// Source Code DIsable
class Listener {
  constructor (MusicService, mailSender) {
    this._musicService = MusicService
    this._mailSender = mailSender

    this.listenData = this.listenData.bind(this)
  }

  async listenData (message) {
    try {
      const { userId, targetEmail } = JSON.parse(message.content.toString())

      const Songs = await this._musicService.getSongs(userId)
      // Dedicated JSON Stringify
      const result = await this._mailSender.send(targetEmail, Songs)
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = Listener
