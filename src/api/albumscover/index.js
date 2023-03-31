const postAlbumsCoverHandler = require('./handler');
const routes = require('./routes'); 
 
module.exports = {
  name: 'albumscover',
  version: '1.0.0',
  register: async (server, { storageService, albumsService, validator }) => {
    const albumsCoverHandler = new postAlbumsCoverHandler(storageService, albumsService, validator);
    server.route(routes(albumsCoverHandler));
  },
};