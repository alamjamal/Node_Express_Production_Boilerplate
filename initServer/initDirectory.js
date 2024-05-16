const path = require('path')
const fs = require('fs').promises;

// Export other directory paths as needed

const directoryPath = {
     ACCESS_LOG_DIR : path.join(__dirname,'..', process.env.ACCESS_LOG_DIR),
     ERROR_LOG_DIR : path.join(__dirname, '..',process.env.ERROR_LOG_DIR),
     DB_DIRECTORY : path.join(__dirname, '..',process.env.DB_DIRECTORY),
     TMP_DIRECTORY : path.join(__dirname, '..',process.env.TMP_DIRECTORY),
     UPLOAD_DIRECTORY_COMMON : path.join(__dirname,'..', process.env.UPLOAD_DIRECTORY_COMMON),
     UPLOAD_DIRECTORY_IMAGE : path.join(__dirname, '..',process.env.UPLOAD_DIRECTORY_IMAGE),
     UPLOAD_DIRECTORY_VIDEO : path.join(__dirname, '..',process.env.UPLOAD_DIRECTORY_VIDEO),
     UPLOAD_DIRECTORY_DOC : path.join(__dirname, '..',process.env.UPLOAD_DIRECTORY_DOC),
}

const createDirectory = async()=>{
    const keys = Object.keys(directoryPath);
    for (let key of keys) {
        if (key.includes('DIR') || key.includes('DIRECTORY')) {
            const dir = directoryPath[key];
            try {
                await fs.access(dir);
                console.log(`Directory already exists: ${dir}`);
            } catch (error) {
                try {
                    await fs.mkdir(dir, { recursive: true });
                    console.log(`Directory created: ${dir}`);
                } catch (error) {
                    console.log(`Directory creation failed: ${error}`);
                    throw error
                }

            }
        }
    }
}

module.exports = {
    directoryPath,
    createDirectory
}
