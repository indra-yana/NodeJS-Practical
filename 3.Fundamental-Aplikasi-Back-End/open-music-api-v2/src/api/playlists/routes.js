const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: (request, h) => handler.postPlaylistHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: (request, h) => handler.getPlaylistsHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}',
        handler: (request, h) => handler.getPlaylistByIdHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'PUT',
        path: '/playlists/{id}',
        handler: (request, h) => handler.putPlaylistByIdHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: (request, h) => handler.deletePlaylistByIdHandler(request, h),
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

module.exports = routes;