const ExportsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, validator, playlistService, listener }) => {
    const exportsHandler = new ExportsHandler(service, validator, playlistService, listener)
    server.route(routes(exportsHandler))
  }
}
