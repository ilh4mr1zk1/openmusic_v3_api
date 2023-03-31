const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(ProducerService, playlistsService, validator) {
    this._service = ProducerService;
    this._validator = validator;
    this._playlistsService = playlistsService;

    autoBind(this);

  }
 
  async postExportPlaylistsHandler(request, h) {

      this._validator.validateExportPlaylistsPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;

      const message = {
        owner       : request.auth.credentials.id,
        playlistId,
        targetEmail : request.payload.targetEmail,
      };

      await this._playlistsService.verifyPlaylistOwners(playlistId, credentialId)
      await this._playlistsService.getPlaylistById(playlistId)
      await this._service.sendMessage('export:playlists', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });

      response.code(201);
      return response;
    
  }

}

module.exports = ExportsHandler;