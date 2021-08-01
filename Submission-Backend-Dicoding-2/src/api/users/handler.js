const errorBundle = require('../../exceptions/errorBundle')

class Userhandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postUserService = this.postUserService.bind(this)
    this.getUserService = this.getUserService.bind(this)
  }

  async postUserService (request, h) {
    try {
      this._validator.validateUserPayload(request.payload)
      const { username, password, fullname } = request.payload

      const userid = await this._service.addUser({ username, password, fullname })

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId: userid
        }
      })

      response.code(201)
      return response
    } catch (error) {
      return errorBundle(error, h)
    }
  }

  async getUserService (request, h) {
    try {
      const { id } = request.parrams
      const user = this._service.getUserById(id)

      return {
        status: 'success',
        data: {
          user
        }
      }
    } catch (error) {
      return errorBundle(error, h)
    }
  }
}

module.exports = Userhandler
