const errorBundle = require('../../exceptions/errorBundle')

class ExportsHandler {
  constructor (service, validator, playlistsService /*, listener */) {
    this._service = service
    this._validator = validator
    this._playlistsService = playlistsService
    // Plungin Listener Disable, Consumer mengunakan aplikasi terpisah
    // this._listener = listener

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this)
  }

  async postExportSongsHandler (request, h) {
    try {
      this._validator.validateExportSongsPayload(request.payload)
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials
      const { targetEmail } = request.payload
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
      const message = {
        playlistId,
        targetEmail: targetEmail
      }

      await this._service.sendQueue('export:songsDataExports', message /*, this._listener* */)

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean'
      })
      response.code(201)
      return response
    } catch (error) {
      return errorBundle(error, h)
    }
  }
}

module.exports = ExportsHandler
