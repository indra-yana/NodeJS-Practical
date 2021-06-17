const ClientError = require('../../exceptions/ClientError');

class SongsHandler {

    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);

            const { title = 'Untitled', year, performer, genre, duration } = request.payload;
            const songId = await this._service.addSong({ title, year, performer, genre, duration });

            return h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId,
                },
            }).code(201);
        } catch (error) {
            return handleError(error, h);
        }

    }

    async getSongsHandler() {
        const songs = await this._service.getSongs();

        return {
            status: 'success',
            data: {
                songs,
            }
        }
    }

    async getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);

            return {
                status: 'success',
                data: {
                    song,
                }
            }
        } catch (error) {
            return handleError(error, h);
        }

    }

    async putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);

            const { id } = request.params;
            await this._service.editSongById(id, request.payload);

            return {
                status: 'success',
                message: 'Lagu berhasil diperbarui',
            };
        } catch (error) {
            return handleError(error, h);
        }
    }

    async deleteSongByIdHandler(request, h) {
        try {
            const { id } = request.params;

            await this._service.deleteSongById(id);

            return {
                status: 'success',
                message: 'Lagu berhasil dihapus',
            };
        } catch (error) {
            return handleError(error, h);
        }

    }

}

const handleError = (error, h) => {
    if (error instanceof ClientError) {
        return h.response({
            status: 'fail',
            message: error.message,
        }).code(error.statusCode);
    }

    // Server Error!
    console.error(error);
    return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
    }).code(500);
}

module.exports = SongsHandler;