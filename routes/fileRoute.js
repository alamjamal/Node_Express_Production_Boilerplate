const express = require("express");
const {directoryPath} = require('../www/initServer/initDirectory')
const fileRoutes = (app)=>{
    app.use(directoryPath.UPLOAD_DIRECTORY_IMAGE, express.static(directoryPath.UPLOAD_DIRECTORY_IMAGE));

}

module.exports={fileRoutes}