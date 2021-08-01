const errorBundle = require('../../exceptions/errorBundle')

class UploadsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this)
  }

  async postUploadImageHandler (request, h) {
    try {
      const { data } = request.payload
      this._validator.validateImageHeaders(data.hapi.headers)

      const fileName = await this._service.write(data, data.hapi)

      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${fileName}`
        }
      })
      response.code(201)
      return response
    } catch (error) {
      return errorBundle(error, h)
    }
  }
}

module.exports = UploadsHandler
