const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const NotFoundError = require('../../exceptions/NotFoundError')
const CollaborationService = require('./CollaborationsService')

class PlaylistService {
  constructor () {
    this._pool = new Pool()
    this._collaborationService = new CollaborationService()
  }

  async postPlaylist ({ name, owner }) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }
    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist Failed to Add')
    }
    return result.rows[0].id
  }

  async getPlaylist (user) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
          LEFT JOIN users ON users.id = playlists.owner
          LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
          WHERE playlists.owner = $1 or collaborations.user_id = $1`,
      values: [user]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Cannot Delete Playlist, Id Not Found')
    }
    return result.rows[0].id
  }

  async postSongToPlaylist (playlistId, songId) {
    const query = {
      text: 'INSERT INTO playlistsongs (playlist_id, song_id) VALUES($1, $2) RETURNING id',
      values: [playlistId, songId]
    }
    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Song Failed to Add to Playlist')
    }
    return result.rows[0].id
  }

  async getSongsFromPlaylist (playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      JOIN playlistsongs
      ON songs.id = playlistsongs.song_id WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async deleteSongFromPlaylist (playlistId, songsId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songsId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Delete Song Failed')
    }
    return result.rows[0].id
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Playlist Not Found')
    }
    const playlist = result.rows[0].owner
    if (playlist !== owner) {
      throw new AuthorizationError('You Dont Have Access To This Resource')
    }
  }

  async verifyPlaylistAccess (playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      try {
        await this._collaborationService.verifyCollab(playlistId, userId)
      } catch {
        throw error
      }
    }
  }

  async getUsersByUsername (username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`]
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = PlaylistService
