const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthError = require('../../exceptions/AuthError');
const QueryError = require('../../exceptions/QueryError');

class UsersService {

    constructor() {
        this._pool = new Pool();
    }

    async addUser({ username, password, fullname }) {
        await this.verifyNewUsername(username);
        
        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await this._pool.query({
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['UsersService', 'addUser'] });
        }

        if (!result.rowCount) {
            throw new InvariantError('User gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getUserById(userId) {
        const result = await this._pool.query({
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['UsersService', 'getUserById'] });
        }

        if (!result.rowCount) {
            throw new NotFoundError({ message: 'User tidak ditemukan', tags: ['UsersService', 'getUserById']});
        }

        return result.rows[0];
    }

    async verifyNewUsername(username) {
        const result = await this._pool.query({
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['UsersService', 'verifyNewUsername'] });
        }

        if (result.rowCount > 0) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan');
        }
    }

    async verifyUserCredential(username, password) {
        const result = await this._pool.query({
            text: 'SELECT id, password FROM users WHERE username = $1',
            values: [username],
        }).catch(error => ({ error }));

        if (result.error) {
            throw new QueryError({ error: result.error, tags: ['UsersService', 'verifyUserCredential'] });
        }

        if (!result.rowCount) {
            throw new AuthError('Kredensial yang Anda berikan salah');
        }

        const { id, password: hashedPassword } = result.rows[0];
        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            throw new AuthError('Kredensial yang Anda berikan salah');
        }

        return id;
    }

}

module.exports = UsersService;