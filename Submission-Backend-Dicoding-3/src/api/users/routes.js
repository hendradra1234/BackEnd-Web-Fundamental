const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserService
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserService
  }
]

module.exports = routes
