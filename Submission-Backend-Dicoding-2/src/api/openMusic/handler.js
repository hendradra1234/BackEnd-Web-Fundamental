const { validateSongsPayload } = require('../../validator/openMusic')
const errorBundle = require('../../exceptions/errorBundle')
const mapOutput = require('../../utils/mapOutput')
class MusicHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postMusicHandler = this.postMusicHandler.bind(this)
    this.getAllMusicHandler = this.getAllMusicHandler.bind(this)
    this.getMusicByIdHandler = this.getMusicByIdHandler.bind(this)
    this.putMusicByIdHandler = this.putMusicByIdHandler.bind(this)
    this.deleteMusicByIdHandler = this.deleteMusicByIdHandler.bind(this)
  }

  /*
  Data Structure
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt
*/

  // Post Database
  async postMusicHandler (Request, h) {
    try {
      this._validator = validateSongsPayload(Request.payload)
      const { title = 'untitled', year, performer = 'uknown', genre, duration } = Request.payload
      const songId = await this._service.addSongs({ title, year, performer, genre, duration })

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId: songId
        }

      })
      response.code(201)
      return response
    } catch (error) {
      return errorBundle(error, h)
    }
  }

  // Get All database
  async getAllMusicHandler () {
    const songs = await this._service.getSongs()
    return {
      status: 'success',
      data: {
        songs: mapOutput(songs)
      }
    }
  }

  // Get Specific Database
  async getMusicByIdHandler (Request, h) {
    try {
      const { id } = Request.params
      const song = await this._service.getSongsById(id)

      return {
        status: 'success',
        data: {
          song
        }
      }
    } catch (error) {
      return errorBundle(error, h)
    }
  }

  // Edit Specific Data in Database
  async putMusicByIdHandler (Request, h) {
    try {
      this._validator = validateSongsPayload(Request.payload)
      const { id } = Request.params
      const { title = 'untitled', year, performer = 'uknown', genre, duration } = Request.payload
      await this._service.editSongsById(id, { title, year, performer, genre, duration })
      return {
        status: 'success',
        message: 'lagu berhasil diperbarui'
      }
    } catch (error) {
      return errorBundle(error, h)
    }
  }

  // Delete Data From Database
  async deleteMusicByIdHandler (Request, h) {
    try {
      const { id } = Request.params
      await this._service.deleteSongsById(id)

      return {
        status: 'success',
        message: 'lagu berhasil dihapus'
      }
    } catch (error) {
      return errorBundle(error, h)
    }
  }
}

module.exports = MusicHandler
