const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
    generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
    generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
    verifyRefreshToken: (refreshToken) => {
        try {
            const artifacts = Jwt.token.decode(refreshToken);

            // console.log(artifacts);
            
            Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
            
            const { payload } = artifacts.decoded;
            
            // console.log(payload);

            return payload;
        } catch (error) {
            throw new InvariantError({ message: 'Refresh token tidak valid', error, tags: ['TokenManager', 'verifyRefreshToken'] });
        }
      
    }
}

module.exports = TokenManager;