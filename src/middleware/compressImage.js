
const sharp = require("sharp");
const { promisify } = require("util");
const {ApiError} = require('../_helpers/apiError')
const httpStatus = require('http-status');
const fs = require("fs");
const path = require("path");


const compressImage = async (req, res, next) => {
		const compressLevel = Number(req.body.compressLevel) || 80;
		if (compressLevel < 10 || compressLevel > 90) {
			throw new ApiError(httpStatus.NOT_ACCEPTABLE,'compressLevel must be between 10 and 90')
		}

		const extension = path.extname(req.file.originalname).toLowerCase();
		let image = sharp(req.file.path);
		if (extension === ".png") {
			image = image.png({
				compressionLevel: Math.round(compressLevel / 10),
				// adaptiveFiltering: true,
				quality: compressLevel

			});
		} else if (extension === ".jpg" || extension === ".jpeg") {
			image = image.jpeg({ 
				compressionLevel: Math.round(compressLevel / 10),
				quality: compressLevel });
		}
  
		const outputPath = `${req.file.path.split(".")[0]}.compressed${extension}`;
		await image.toFile(outputPath);
  
		// Attach the compressed file path to the request object
		req.compressedFilePath = outputPath;
  
		// Remove the original file
		const unlink = promisify(fs.unlink);
		await unlink(req.file.path);  
		next();
	
};

module.exports={ compressImage};
