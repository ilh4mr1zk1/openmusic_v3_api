const routes = (handler) => [

    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postSongToPlaylistsHandler,
        options: {
          auth: 'openmusicv3_jwt',
        },
    },

    {
        method: "GET",
        path: "/playlists/{id}/songs",
        handler: handler.getPlaylistsongByIdHandler,
        options: {
          auth: "openmusicv3_jwt",
        },
    },

    {
        method: "DELETE",
        path: "/playlists/{id}/songs",
        handler: handler.deletePlaylistsongHandler,
        options: {
          auth: "openmusicv3_jwt",
        },
    },

];

module.exports = routes;