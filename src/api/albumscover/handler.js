const autoBind = require('auto-bind');

class AlbumsCoverHandler {
  
  constructor(storageService, albumsService, validator) {
    this._service = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this); 
    
  }

  async postAlbumsCoverHandler(request, h) {

    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateAlbumCoverHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${filename}`;
    console.log(fileLocation);
    const dataCover = await this._albumsService.addAlbumCover(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });

    response.code(201);
    return response;

  }

}

module.exports = AlbumsCoverHandler;