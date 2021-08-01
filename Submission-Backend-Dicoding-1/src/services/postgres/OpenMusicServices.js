const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions//InvariantError')
const mapDBSongsModel = require('../../utils')
const NotFoundError = require('../../exceptions/NotFoundError')

/*
  Database Structure
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt
*/
class OpenMusicService {
  constructor () {
    this._pool = new Pool()
  }

  // add
  async addSongs ({ title, year, performer, genre, duration }) {
    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Add Song Failed')
    }

    return result.rows[0].id
  }

  // getAll
  async getSongs () {
    const result = await this._pool.query('SELECT * FROM songs')
    return result.rows.map(mapDBSongsModel)
  }

  // getOne
  async getSongsById (id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Song Not Found')
    }
    return result.rows.map(mapDBSongsModel)[0]
  }

  // update
  async editSongsById (id, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id ',
      values: [title, year, performer, genre, duration, updatedAt, id]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Song Update Falied, Cannot Find related ID')
    }
  }

  // delete
  async deleteSongsById (id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Delete Song Failed, Cannot Find Id')
    }
  }
}

module.exports = OpenMusicService
