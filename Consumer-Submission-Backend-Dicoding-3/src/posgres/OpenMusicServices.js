const { Pool } = require('pg')

class OpenMusicServices {
  constructor (CacheService) {
    this._pool = new Pool()
    this._cacheService = new CacheService()
  }

  // getAll
  async getSongsFromPlaylist (playlistId) {
    try {
      const result = await this._cacheService.get(`songs:${playlistId}`)
      return JSON.parse(result)
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      JOIN playlistsongs
      ON songs.id = playlistsongs.song_id WHERE playlistsongs.playlist_id = $1`,
        values: [playlistId]
      }

      const result = await this._pool.query(query)

      // menyimpan lagu ke cache
      await this._cacheService.set(`songs:${playlistId}`, JSON.stringify(result.rows))
      return result.rows
    }
  }
}
module.exports = OpenMusicServices
