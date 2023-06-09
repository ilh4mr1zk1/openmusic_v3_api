const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvariantError');
const NotFoundError = require('../../../exceptions/NotFoundError');
const { mapDBALBUMToModel } = require('../../../utils/album');
const { mapDBSONGToModel } = require('../../../utils/song');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO album VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
 
    return result.rows[0].id;

  }

  async addAlbumCover(id, cover) {

    const query = {
      text: 'UPDATE album SET cover = $1 WHERE id = $2 RETURNING id',
      values: [cover, id] 
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui cover pada album. Id tidak ditemukan');
    }

  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM song');
    return result.rows.map(mapDBSONGToModel);
  }


  async getAlbumById(id) {
    const query = {
      text: `SELECT album.id, album.name, album.year, album.cover as "coverUrl" FROM album WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if ( !result.rowCount ) {
      throw new NotFoundError('Album tidak ditemukan');
    }
 
    return result.rows.map(mapDBALBUMToModel)[0];

  }

  async editAlbumById(id, { name, year }) {
    
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }

  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }

  }

}

module.exports = AlbumsService;