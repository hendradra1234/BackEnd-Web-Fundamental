const ClientError = require('./ClientError')
const errorBundle = (error, h) => {
  if (error instanceof ClientError) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })
    response.code(error.statusCode)
    return response
  }

  // Internal Server Error
  const response = h.response({
    status: 'error',
    message: 'Internal Server Error, sorry for this problem'
  })
  response.code(500)
  console.error(error)
  return response
}

module.exports = errorBundle
