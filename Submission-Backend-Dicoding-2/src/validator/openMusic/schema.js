const Joi = require('joi')

const SongsPayloadSchema = Joi.object({
  // string,required
  title: Joi.string().required(),
  // number,required
  year: Joi.number().required(),
  // string,reduired
  performer: Joi.string().required(),
  // String
  genre: Joi.string(),
  // number
  duration: Joi.number()
})

module.exports = { SongsPayloadSchema }
