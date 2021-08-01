const InvariantError = require('../../exceptions/InvariantError')
const { playlistPayloadSchema, playlistSongPayloadSchema } = require('./schema')

const PlaylistValidation = {
  validatePlaylistPayload: (payload) => {
    const validationResult = playlistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validatePlaylistSongPayload: (payload) => {
    const validationResult = playlistSongPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = PlaylistValidation
