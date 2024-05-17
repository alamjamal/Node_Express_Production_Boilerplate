const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const { format } = require('date-fns');
const os = require('os');
const {directoryPath} = require("../initServer/initDirectory");

// Create a stream with rotating-file-stream
const accessLogStream = rfs.createStream('access.log', {
	size: '5K', // rotate every 1 megabyte written
	interval: '2d', // rotate every 30 days
	path: directoryPath.ACCESS_LOG_DIR,
	maxFiles:5,

});

// Define custom format with more detailed date
morgan.token('date', function () {
	return format(new Date(), 'dd/MM/yyyy hh:mm:ss a');
});
const customFormat = ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Setup Morgan to use the custom format and rotating stream
// app.use(morgan("combined", { stream: morgonLogger, skip: (req, res) => req.url === "/" }));

const morgonLogger = morgan(customFormat, {
	stream: accessLogStream,
	skip: (req, res) => req.url === "/",
});

console.log("Morgon Logger Started...")
module.exports = { morgonLogger };
