const errorBundle = require('../../exceptions/errorBundle')

class Collaborationhandler {
  constructor (collaborationService, playlistServices, validator) {
    this._collaborationService = collaborationService
    this._playlistService = playlistServices
    this._validator = validator

    this.postCollab = this.postCollab.bind(this)
    this.deleteCollab = this.deleteCollab.bind(this)
  }

  async postCollab (request, h) {
    try {
      this._validator.validateCollaborationpayload(request.payload)
      const { id: credentialId } = request.auth.credentials
      const { playlistId, userId } = request.payload

      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId)
      const collabId = await this._collaborationService.addCollab(playlistId, userId)

      const response = h.response({
        status: 'success',
        message: 'berhasil Menambahkan Kolaborasi',
        data: {
          collabId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      return errorBundle(error, h)
    }
  }

  async deleteCollab (request, h) {
    try {
      this._validator.validateCollaborationpayload(request.payload)
      const { id: credentialId } = request.auth.credentials
      const { playlistId, userId } = request.payload

      await this._playlistService.verifyPlaylistOwner(playlistId, credentialId)
      await this._collaborationService.deleteCollab(playlistId, userId)

      return {
        status: 'success',
        message: 'Berhasil Menghapus Kolaborasi'
      }
    } catch (error) {
      return errorBundle(error, h)
    }
  }
}

module.exports = Collaborationhandler
