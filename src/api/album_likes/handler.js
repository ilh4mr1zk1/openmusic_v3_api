const autoBind = require('auto-bind');

class AlbumLikesHandler {
  
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this); 
    
  }

  async postAlbumLikesHandler(request, h) {

    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._service.verifyAlbums(albumId);
    await this._service.getAlbumLikesById(credentialId)
    await this._service.addAlbumLikes(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Menyukai album'
    })
    
    response.code(201)
    return response;

  }

  async getAlbumLikesHandler(request, h) {

    const {id} = request.params;
    const dataLikes = await this._service.getDataAlbumLikes(id);

    let countingDataLikes = 0;

    for (let i = 0; i < dataLikes.data.length; i++) {
      countingDataLikes++;
    }

    const response = h.response({

      status: 'success',
      data: {
        likes : countingDataLikes
      }

    });

    if ( dataLikes.dataCache == 1 ) {
      response.header('X-Data-Source', 'cache')
    }

    response.code(200);
    
    return response;
  }

  async deleteAlbumUnlikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._service.deleteAlbumLikes(id, credentialId);
    
    return {
      status: 'success',
      message: 'Batal menyukai album',
    };
    
  }

}

module.exports = AlbumLikesHandler;