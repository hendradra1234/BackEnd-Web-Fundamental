require('dotenv').config()
const Hapi = require('@hapi/hapi')
const music = require('./api/openMusic')
const OpenMusicService = require('./services/postgres/OpenMusicServices')
const OpenMusicValidator = require('./validator/openMusic')

const init = async () => {
  const openMusicService = new OpenMusicService()
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

  // Optional
  // server.route(routes);

  // registrasi plungin
  await server.register({
    plugin: music,
    options: {
      service: openMusicService,
      validator: OpenMusicValidator
    }
  })

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
