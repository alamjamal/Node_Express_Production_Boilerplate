const compression = require('compression');
const compressionOption= {
    level: 1, // Compression level (1-9)
    threshold: 10240, // Minimum response size to compress (bytes)
    minRatio: 0.8, // Ratio of compressed to uncompressed size to trigger compression
    cache: true, // Enable caching of compressed files
    filter: (req, res) => {
        // Exclude image files from compression
        if (/\.jpg$|\.jpeg$|\.png$|\.gif$/.test(req.path)) {
            return false;
        }
        return true;
    }
}
const compressionSetup = compression(compressionOption)
module.exports=compressionSetup