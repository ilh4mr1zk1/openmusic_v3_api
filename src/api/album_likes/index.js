const AlbumLikesHandler = require('./handler');
const routes = require('./routes'); 
 
module.exports = {
  name: 'albumlikes',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumlikesHandler = new AlbumLikesHandler(service, validator);
    server.route(routes(albumlikesHandler));
  },
};