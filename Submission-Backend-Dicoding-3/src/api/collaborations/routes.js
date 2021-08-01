const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollab,
    options: {
      auth: 'openmusicapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollab,
    options: {
      auth: 'openmusicapp_jwt'
    }
  }
]

module.exports = routes
