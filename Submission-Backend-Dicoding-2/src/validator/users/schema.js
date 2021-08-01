const Joi = require('joi')

const UserPayloadSchema = Joi.object({
  // username
  username: Joi.string().required(),
  // password
  password: Joi.string().required(),

  // fullname
  fullname: Joi.string().required()
})

module.exports = { UserPayloadSchema }
