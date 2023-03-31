const path = require('path');

const routes = (handler) => [

    {
      method: 'POST',
      path: '/albums/{id}/covers',
      handler: handler.postAlbumsCoverHandler,
      options: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
          maxBytes : 512000,
          output: 'stream',
        },
      },
    },

    {
      method: 'GET',
      path: '/albums/{id}/covers/{param*}',
      handler: {
        directory: {
          path: path.resolve(__dirname, 'file/images'),
        },
      },
    },

];

module.exports = routes;