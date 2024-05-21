const { createLogger, format } = require("winston");
const winston = require("winston");
const path = require('path')


const fileFormat = format.combine(
    format.timestamp({
        format: "DD-MM-YYYY HH:mm:ss" // Custom timestamp format
    }),
    format.json(),
);

const consoleFormat = format.combine(
    format.timestamp({
        format: "DD-MM-YYYY hh:mm:ss a" // Custom timestamp format
    }),
    format.printf(({ timestamp, level, message,   }) => `[${timestamp}] ${level}: ${message}`),

)

const systemLogger = createLogger({
    // format:logFormat,
    handleExceptions: true,
    handleRejections: true,
    transports: [
        new winston.transports.Console({
            format: consoleFormat
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '..', '..', "./.logs/systemLogs.log"),
            format: fileFormat
        })
    ]
});

systemLogger.info("2. System Logger Started....")
module.exports = { systemLogger }