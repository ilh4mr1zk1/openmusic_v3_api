const routes = (handler) => [

    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.postAlbumLikesHandler,
        options: {
          auth: 'openmusicv3_jwt',
        },
    },

    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handler.getAlbumLikesHandler,
    },

    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: handler.deleteAlbumUnlikesHandler,
        options: {
          auth: 'openmusicv3_jwt',
        },
    },

];

module.exports = routes;