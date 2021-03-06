const { nanoid } = require("nanoid");
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapSongsDBToModel2, mapSongsDBToModel } = require("../../utils");

class SongsService {

    constructor() {
        this._songs = [];
    }

    addSong({ title, year, performer, genre, duration }) {
        const id = `song-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const newSong = {
            id, title, year, performer, genre, duration, inserted_at: insertedAt, updated_at: updatedAt, 
        }

        this._songs.push(newSong);
        const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
    
        if (!isSuccess) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return id;
    }

    getSongs() {
        return this._songs.map(mapSongsDBToModel2);
    }

    getSongById(id) {
        const song = this._songs.filter((song) => song.id === id).map(mapSongsDBToModel)[0];

        if (!song) {
            throw new NotFoundError('Lagu tidak ditemukan')
        }

        return song;
    }

    editSongById(id, { title, year, performer, genre, duration }) {
        const index = this._songs.findIndex((song) => song.id === id);
        const updatedAt = new Date().toISOString();

        if (index === -1) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }

        this._songs[index] = {
            ...this._songs[index], title, year, performer, genre, duration, updatedAt,
        }
    }

    deleteSongById(id) {
        const index = this._songs.findIndex((song) => song.id === id);

        if (index === -1) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }

        this._songs.splice(index, 1);
    }

}

module.exports = SongsService;