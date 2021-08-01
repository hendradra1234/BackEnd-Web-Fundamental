class Listener {
  constructor (MusicService, mailSender) {
    this._musicService = MusicService
    this._mailSender = mailSender

    this.listenData = this.listenData.bind(this)
  }

  async listenData (message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString())

      const playlistSongs = await this._musicService.getSongsFromPlaylist(playlistId)
      // Dedicated JSON Stringify
      const result = await this._mailSender.send(targetEmail, playlistSongs)
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = Listener
