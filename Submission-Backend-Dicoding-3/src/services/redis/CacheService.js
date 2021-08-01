const redis = require('redis')

class CacheService {
  constructor () {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER
    })
    this._client.on('error', (error) => {
      console.error(error)
    })
  }

  set (key, value, expirationInSecond = 3600) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(ok)
        }
      })
    })
  }

  get (key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
        if (error) {
          return reject(error)
        } else if (reply === null) {
          return reject(new Error('Cache Not Found'))
        } else {
          return resolve(reply.toString())
        }
      })
    })
  }

  delete (key) {
    return new Promise((resolve, reject) => {
      this._client.del(key, (error, count) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(count)
        }
      })
    })
  }
}

module.exports = CacheService
