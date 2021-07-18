const InvariantError = require('../../exceptions/InvariantError');
const { ImageHeadersSchema } = require('./schema');
 
const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);
 
    if (validationResult.error) {
        throw new InvariantError({ 
            message: 'Gagal validasi', 
            error: validationResult.error, 
            tags: ['UploadsValidator', 'validateImageHeaders'], 
        });
    }
  },
};
 
module.exports = UploadsValidator;