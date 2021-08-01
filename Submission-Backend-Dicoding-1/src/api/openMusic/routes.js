const routes = (handler) => [
  // save songs
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postMusicHandler
  },
  // view all songs
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAllMusicHandler
  },
  // View song by id
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getMusicByIdHandler
  },
  // Update song
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putMusicByIdHandler
  },
  // Delete song
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteMusicByIdHandler
  }

]

module.exports = routes
