const errorBuandle = require('../../exceptions/errorBundle')

class AuthenticationsHandler {
  constructor (authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService
    this._usersService = usersService
    this._tokenManager = tokenManager
    this._validator = validator

    this.postAuthHandler = this.postAuthHandler.bind(this)
    this.putAuthHandler = this.putAuthHandler.bind(this)
    this.deleteAuthHandler = this.deleteAuthHandler.bind(this)
  }

  async postAuthHandler (request, h) {
    try {
      this._validator.validatePostAuthPayload(request.payload)

      const { username, password } = request.payload
      const id = await this._usersService.verifyUserCredential(username, password)

      const accessToken = this._tokenManager.generateAccessToken({ id })
      const refreshToken = this._tokenManager.generateRefreshToken({ id })

      await this._authenticationsService.addRefreshToken(refreshToken)

      const response = h.response({
        status: 'success',
        message: 'berhasil ditambahkan Authentication ',
        data: {
          accessToken,
          refreshToken
        }
      })
      response.code(201)
      return response
    } catch (error) {
      return errorBuandle(error, h)
    }
  }

  async putAuthHandler (request, h) {
    try {
      this._validator.validatePutAuthPayload(request.payload)

      const { refreshToken } = request.payload
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken)

      const accessToken = this._tokenManager.generateAccessToken({ id })
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken
        }
      }
    } catch (error) {
      return errorBuandle(error, h)
    }
  }

  async deleteAuthHandler (request, h) {
    try {
      this._validator.validateDeleteAuthPayload(request.payload)

      const { refreshToken } = request.payload
      await this._authenticationsService.verifyRefreshToken(refreshToken)
      await this._authenticationsService.deleteRefreshToken(refreshToken)

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus'
      }
    } catch (error) {
      return errorBuandle(error, h)
    }
  }
}

module.exports = AuthenticationsHandler
