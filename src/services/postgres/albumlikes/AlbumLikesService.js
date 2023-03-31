const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvariantError');
const NotFoundError = require('../../../exceptions/NotFoundError');
const AuthenticationError = require('../../../exceptions/AuthenticationError');
const ClientError = require('../../../exceptions/ClientError');
const { mapDBALBUMToModel } = require('../../../utils/album');
const { mapDBSONGToModel } = require('../../../utils/song');
const { mapDBALBUMLIKEToModel } = require('../../../utils/albumlikes');

class AlbumLikesService {
  constructor(cacheServices) {
    this._pool = new Pool();
    this._cacheService = cacheServices;
  }

  async addAlbumLikes(user_id, album_id) {
    
    const id = `albumlikes-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO useralbumlikes VALUES($1, $2, $3) RETURNING id',
      values: [id, user_id, album_id],
    };

    const checkData = await this._pool.query('SELECT * FROM useralbumlikes');

    let count = 0;

    if ( checkData.rowCount == 0 ) {

      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError(`Album gagal disukai`);
      }

      const deleteData  = await this._cacheService.delete(`likes:${album_id}`);
      console.log(`hapus data cache ${deleteData}`);
      return result.rows[0].id;      

    } else {

      const checkDb = await this._pool.query('SELECT * FROM useralbumlikes');

      console.log(checkDb.rows[0].user_id);

      if ( checkDb.rows[0].user_id === user_id ) {

        throw new ClientError(`user dengan id ${user_id} dan Album dengan id ${album_id} sudah di sukai`);

      } else {

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
          throw new InvariantError(`Album gagal disukai`);
        }

        const deleteDataFromCache =  await this._cacheService.delete(`likes:${album_id}`);

        return result.rows[0].id;

      }

    }

  }

  async getDataAlbumLikes(album_id) {

    try {
      
      const result = await this._cacheService.get(`likes:${album_id}`);

      return {
        data : JSON.parse(result),
        dataCache: 1
      };

    } catch (e) {

      const query = {
        text: 'SELECT * FROM useralbumlikes WHERE album_id = $1',
        values: [album_id],
      };

      const result = await this._pool.query(query);

      const mappedResult = result.rows.map(mapDBALBUMLIKEToModel);

      if (!result.rows.length) {
        throw new NotFoundError('Album id tidak ditemukan');
      }

      const createCache = await this._cacheService.set(`likes:${album_id}`, JSON.stringify(mappedResult));

      return {
        data: mappedResult,
        dataCache: 0
      };

    }

  }

  async getAlbumLikesById(user_id) {

    try {

      const result = await this._cacheService.get(`likes:${user_id}`);
      return JSON.parse(result);

    } catch (e) {

      const query = {
        text: `select * from useralbumlikes WHERE user_id = $1`,
        values: [user_id],
      };

      const result = await this._pool.query(query);

      return result;

    }

  }

  async verifyAlbums(id) {
    const query = {
      text: "SELECT * FROM album WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("id album tidak ditemukan. Pastikan Id tersebut Valid");
    }

  }

  async deleteAlbumLikes(album_id, user_id) {

    const query = {
      text: "DELETE FROM useralbumlikes WHERE album_id = $1 AND user_id = $2 RETURNING id",
      values: [album_id, user_id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new ClientError("Gagal dihapus. Pastikan album id Valid");
    }

    const hapusCache = await this._cacheService.delete(`likes:${album_id}`);

  }

}

module.exports = AlbumLikesService;