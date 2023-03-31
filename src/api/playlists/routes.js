const routes = (handler) => [

    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
          auth: 'openmusicv3_jwt',
        },
    },

    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsHandler,
        options: {
          auth: 'openmusicv3_jwt',
        },
    },

    {
        method: "GET",
        path: "/playlists/{id}",
        handler: handler.getPlaylistByIdHandler,
        options: {
          auth: "openmusicv3_jwt",
        },
    },
    
    {
        method: "DELETE",
        path: "/playlists/{id}",
        handler: handler.deletePlaylistByIdHandler,
        options: {
          auth: "openmusicv3_jwt",
        },
    },

];

module.exports = routes;