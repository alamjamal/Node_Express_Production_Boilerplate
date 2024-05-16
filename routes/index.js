const {initRoutes} = require('./initRoute')
const {fileRoutes} = require('./fileRoute')
const {mainRoutes} = require('./mainRoute')
const setupAllRoutes = (app) => {
    initRoutes(app);
    fileRoutes(app);
    mainRoutes(app);
};

module.exports = {
    setupAllRoutes
};

