const CollaborationHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { collabService, playlistService, validator }) => {
    const collaborationsHandler = new CollaborationHandler(
      collabService, playlistService, validator
    )
    server.route(routes(collaborationsHandler))
  }
}
