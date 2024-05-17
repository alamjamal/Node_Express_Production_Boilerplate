/* eslint-disable no-unused-vars */
const morgan = require("morgan");
const winston = require("winston");
const { createLogger, format } = require("winston");
const fs = require("fs");
const {directoryPath} = require("../initServer/initDirectory");
const rfs = require("rotating-file-stream");




// const logOptions = {
//   level: 'error',
//   filename: path.join(logDirectory, 'error.log'),
//   format: format.combine(
//     format.timestamp(),
//     format.json()
//   ),
//   handleExceptions: true,
//   maxsize: 5242880, // 5MB
//   maxFiles: 5
// };




const logOptions = {
	interval: "2d", // rotate daily
	path: directoryPath.ERROR_LOG_DIR,
	size: "50K", // maximum file size
	maxFiles: 5 // maximum number of files to keep
};
const logFormat = format.combine(
	// format.timestamp(),
	// format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`)
	format.timestamp({
		format: "DD-MM-YYYY hh:mm:ss a" // Custom timestamp format
	}),
	// format.timestamp(),
	format.json()
);


const logger = createLogger({
	format: logFormat,
	handleExceptions: true,
	transports: [
		new winston.transports.Stream({
			stream: rfs.createStream("error.log", logOptions)
		})
	]
});

const logErrorResponses = (err, req, res, next) => {
	if( err.statusCode >= 500){
		const logMessage = {
			statusCode: err.statusCode,
			url: req.originalUrl,
			method: req.method,
			message: err.message,
		};
		logger.info(logMessage);
		logger.error(err.stack);
	}
	
	// next(err);
};

console.log("Winston Logger Started...")
module.exports = { logErrorResponses, logger};
