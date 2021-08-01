const errorBundle = require('../../exceptions/errorBundle')

class Playlisthandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistsHandler = this.postPlaylistsHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
    this.postSongHandler = this.postSongHandler.bind(this)
    this.getSongsHandler = this.getSongsHandler.bind(this)
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this)
  }

  async postPlaylistsHandler (request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload)
      const { name } = request.payload
      const { id: credentialId } = request.auth.credentials
      const playlistId = await this._service.postPlaylist({
        name, owner: credentialId
      })
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      return errorBundle(error, h)
    }
  }

  async getPlaylistsHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._service.getPlaylist(credentialId)
    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async deletePlaylistByIdHandler (request, h) {
    try {
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistOwner(playlistId, credentialId)
      await this._service.deletePlaylistById(playlistId)

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus'
      }
    } catch (error) {
      return errorBundle(error, h)
    }
  }

  async postSongHandler (request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload)
      const { playlistId } = request.params
      const { songId } = request.payload
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistAccess(playlistId, credentialId)

      await this._service.postSongToPlaylist(playlistId, songId)

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist'
      })
      response.code(201)
      return response
    } catch (error) {
      return errorBundle(error, h)
    }
  }

  async getSongsHandler (request, h) {
    try {
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistAccess(playlistId, credentialId)

      const songs = await this._service.getSongsFromPlaylist(playlistId)
      return {
        status: 'success',
        data: {
          songs
        }
      }
    } catch (error) {
      return errorBundle(error, h)
    }
  }

  async deleteSongByIdHandler (request, h) {
    try {
      const { playlistId } = request.params
      const { songId } = request.payload
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistAccess(playlistId, credentialId)
      await this._service.deleteSongFromPlaylist(playlistId, songId)

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist'
      }
    } catch (error) {
      return errorBundle(error, h)
    }
  }

  async getUsersByUsernameHandler (request, h) {
    try {
      const { username = '' } = request.query
      const users = await this._service.getUsersByUsername(username)
      return {
        status: 'success',
        data: {
          users
        }
      }
    } catch (error) {
      return errorBundle(error, h)
    }
  }
}

module.exports = Playlisthandler
