const multer = require("multer");
const {ApiError} = require('../_helpers/apiError')
const httpStatus  = require('http-status')

const multerError =  (err, req, res,  next) => {

    if (err instanceof multer.MulterError) {
        // Handle Multer errors here.
        let error = 'File upload error';
        switch (err.code) {
            case 'LIMIT_PART_COUNT':
                error = 'Too many parts';
                break;
            case 'LIMIT_FILE_SIZE':
                error = 'File too large';
                break;
            case 'LIMIT_FILE_COUNT':
                error = 'Too many files';
                break;
            case 'LIMIT_FIELD_KEY':
                error = 'Field name too long';
                break;
            case 'LIMIT_FIELD_VALUE':
                error = 'Field value too long';
                break;
            case 'LIMIT_FIELD_COUNT':
                error = 'Too many fields';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                error = 'Unexpected file field';
                break;
        }
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, error)

    } else if (err) {
        throw new ApiError(err.statusCode,err.message)
    }

    next();
}


const checkFile =  (req, res, next) => {
    if (!req.file) {
        next(new ApiError(httpStatus.NOT_ACCEPTABLE, 'Please Upload File'))
    }
    next()
}


module.exports = {multerError,checkFile}