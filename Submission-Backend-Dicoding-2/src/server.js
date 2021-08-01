require('dotenv').config()

// Hapi
const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

// Open Music
const music = require('./api/openMusic')
const OpenMusicService = require('./services/postgres/OpenMusicServices')
const OpenMusicValidator = require('./validator/openMusic')

// authenticator
const auth = require('./api/authentications')
const AuthService = require('./services/postgres/AuthenticationsService')
const TokenManager = require('./tokenize//TokenManager')
const Authvalidator = require('./validator/authentications')

// collaboration
const collab = require('./api/collaborations')
const CollabService = require('./services/postgres/CollaborationsService')
const CollabValidator = require('./validator/collaborations')

// users
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

// playlist
const playlists = require('./api/playlist')
const PlaylistService = require('./services/postgres/PlaylistService')
const PlaylistValidator = require('./validator/playlist')

const init = async () => {
  const collabService = new CollabService()
  const playlistService = new PlaylistService()
  const openMusicService = new OpenMusicService()
  const authService = new AuthService()
  const usersService = new UsersService()

  const server = Hapi.server({
    port: process.env.PORT,
    // Optional
    // host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register({
    plugin: Jwt
  })

  // Auth Strategy
  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  // registrasi plungin
  await server.register([
    // main open music
    {
      plugin: music,
      options: {
        service: openMusicService,
        validator: OpenMusicValidator
      }
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        validator: PlaylistValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: auth,
      options: {
        authService,
        usersService,
        tokenManager: TokenManager,
        validator: Authvalidator
      }
    },
    {
      plugin: collab,
      options: {
        collabService,
        playlistService,
        validator: CollabValidator
      }
    }
  ])

  await server.start()
  // mengambil data pemforma system
  const Usagecpu = process.cpuUsage()
  const Usagememory = process.memoryUsage()

  // menampilkan data pemforma
  console.log('\nServer Resources Used\n=================================')
  console.log(`User CPU Usage : ${Usagecpu.user} `)
  console.log(`System CPU Usage : ${Usagecpu.system}`)
  console.log(`Memory Heap Total : ${Usagememory.heapTotal / 1048576} MB`)
  console.log('=================================\n')

  // menampilkan server running domain
  console.log('Server Already Running in Domain\n=================================')
  console.log(`${server.info.uri} \n=================================`)
  console.log('\nRESTful API Running in Domain\n=================================')
  console.log(`${server.info.uri}/songs \n=================================`)
}

init()
