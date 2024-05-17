const multer = require("multer");
const path = require("path");
const {ApiError} = require('../_helpers/apiError')
const httpStatus  = require('http-status')
const {directoryPath} = require('../../www/initServer/initDirectory')
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		const filesDir = directoryPath.UPLOAD_DIRECTORY_IMAGE;
		cb(null, filesDir);
	},
	filename: function(req, file, cb) {
		// let extArray = file.mimetype.split("/");
		// let extension = extArray[extArray.length - 1];
		cb(null, new Date().toISOString().replace(/[:.]/g, "-")+path.extname(file.originalname));
	}
});

const fileFilter = (req, file, cb) => {
    // Reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new ApiError(httpStatus.NOT_ACCEPTABLE, "Please Upload Image File"), false);
    }
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024*1024*10
	},
	fileFilter: fileFilter
})


module.exports={upload}