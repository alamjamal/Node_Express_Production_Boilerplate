const path = require('path')
const fs = require('fs').promises;
const { systemLogger } = require('./initSysLogger')
// Export other directory paths as needed

const directoryPath = {
    ACCESS_LOG_DIR: path.join(__dirname, '..', '..', process.env.ACCESS_LOG_DIR || "/public/log/accessLog/",),
    ERROR_LOG_DIR: path.join(__dirname, '..', '..', process.env.ERROR_LOG_DIR || "/public/log/errorLog/",),
    DB_DIRECTORY: path.join(__dirname, '..', '..', process.env.DB_DIRECTORY || "/public/db_backup/",),
    TMP_DIRECTORY: path.join(__dirname, '..', '..', process.env.TMP_DIRECTORY || "/public/tmp/",),
    UPLOAD_DIRECTORY_COMMON: path.join(__dirname, '..', '..', process.env.UPLOAD_DIRECTORY_COMMON || "/public/upload/upload/",),
    UPLOAD_DIRECTORY_IMAGE: path.join(__dirname, '..', '..', process.env.UPLOAD_DIRECTORY_IMAGE || "/public/upload/image/",),
    UPLOAD_DIRECTORY_VIDEO: path.join(__dirname, '..', '..', process.env.UPLOAD_DIRECTORY_VIDEO || "/public/upload/video/",),
    UPLOAD_DIRECTORY_DOC: path.join(__dirname, '..', '..', process.env.UPLOAD_DIRECTORY_DOC || "/public/upload/doc/",),
    SYSTEM_LOG_DIR: path.join(__dirname, '..', '..', process.env.SYSTEM_LOG_DIR || "/public/log/systemLog/",),
}


const createDirectory = async () => {
    const keys = Object.keys(directoryPath);
    systemLogger.info(`3. Directory Setup Started...`);
    for (let key of keys) {
        if (key.includes('DIR') || key.includes('DIRECTORY')) {
            const dir = directoryPath[key];
            try {
                await fs.access(dir);

            } catch (error) {
                try {
                    await fs.mkdir(dir, { recursive: true });
                    systemLogger.info(`Directory created: ${dir}`);
                } catch (error) {
                    systemLogger.error(`Directory creation failed: ${error}`);
                    process.exit(1)
                }
            }
        }
    }
}

module.exports = {
    directoryPath,
    createDirectory
}
