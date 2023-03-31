// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const ClientError = require('./exceptions/ClientError');
const InvariantError = require('./exceptions/InvariantError');
const NotFoundError = require('./exceptions/NotFoundError');
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/album/AlbumsService');
const AlbumsValidator = require('./validator/album');

// album likes
const albumlikes = require('./api/album_likes');
const AlbumLikesService = require('./services/postgres/albumlikes/AlbumLikesService');

// albums with cover
const albumscover = require('./api/albumscover');
const StorageService = require('./services/storage/StorageService');
const AlbumsCoverValidator = require('./validator/albumcover');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/song/SongsService');
const SongsValidator = require('./validator/song');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/users/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/authentications/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/Collaborations/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Exports
const _exports = require('./api/export');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/export');

//playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/playlists/PlaylistsService');
const PlaylistsValidator = require('./validator/playlist');

// playlistsongs
const playlistsongs = require('./api/playlistsongs');
const PlaylistSongsService = require('./services/postgres/playlist_song/PlaylistSongsService')
const PlaylistSongsValidator = require('./validator/playlist_songs');

// cache
const CacheServices = require('./services/redis/CacheServices');

const init = async () => {
  const cacheServices = new CacheServices();
  const collaborationsService = new CollaborationsService();
  const albumsService = new AlbumsService();
  const albumLikesService = new AlbumLikesService(cacheServices);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const playlistsongsService = new PlaylistSongsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/albumscover/file/images'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([

    {
      plugin: Jwt,
    },

    {
      plugin: Inert,
    },

  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusicv3_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator
      }
    },

    {
      plugin: albumlikes,
      options: {
        service: albumLikesService
      }
    },

    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator
      }
    },

    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      }
    },

    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },

    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },

    {
      plugin: _exports,
      options: {
        ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },

    {
      plugin: playlists,
      options: {
        playlistsService,
        usersService,
        validator: PlaylistsValidator,
      },
    },

    {
      plugin: playlistsongs,
      options: {
        playlistsongsService,
        playlistsService,
        validator: PlaylistSongsValidator,
      },
    },

    {
      plugin : albumscover,
      options : {
        storageService,
        albumsService,
        validator: AlbumsCoverValidator
      }
    }

  ]);

  server.ext('onPreResponse', (request, h) => {

    const { response } = request;
    if (response instanceof Error) {
 
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });

        newResponse.code(response.statusCode);
        return newResponse;

      }

      if (!response.isServer) {
        return h.continue;
      }
      
      console.log(response);
      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server.',
      });

      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);

};
 
 
init();