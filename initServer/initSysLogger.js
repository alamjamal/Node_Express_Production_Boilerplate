const { createLogger, format } = require("winston");
const { directoryPath } = require('./initDirectory')
const winston = require("winston");



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
            filename: `${directoryPath.SYSTEM_LOG_DIR}/systemLogs.log`,
            format: fileFormat
        })
    ]
});

systemLogger.info("systemLogger Started....")
module.exports = { systemLogger }