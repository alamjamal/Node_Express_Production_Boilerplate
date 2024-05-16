/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const Sentry = require("@sentry/node");


// app.use(bodyParser.urlencoded({ limit: "5mb", extended: true, parameterLimit: 1000 }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "20mb", extended: true, parameterLimit: 1000 }));

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(cookieParser())


if (process.env.NODE_ENV === "production") {
	const corsSetup = require("./src/_helpers/appOptions/corsOptions");
	app.use(corsSetup);

	// set security HTTP headers
	const helmetSetup = require("./src/_helpers/appOptions/helmetOption");
	app.use(helmetSetup);

	//enable compression

	const compressionSetup = require('./src/_helpers/appOptions/compressionOption')
	app.use(compressionSetup);


	//log request handler
	const { morgonLogger } = require("./src/_helpers/logger/morgonLogger");
	app.use(morgonLogger)

	//rate the limit 
	const rateLimiterSetup = require("./src/_helpers/appOptions/rateLimitOption");
	app.use(rateLimiterSetup);


	const { initSentry } = require('./initServer/initSentry')
	initSentry(app);
	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());


}

const {setupAllRoutes }  = require('./routes/index')
setupAllRoutes(app)



app.use(Sentry.Handlers.errorHandler());



//response error handler
const { errorHandlerResponser } = require("./src/_helpers/errorHandler/errorHandler");
app.use(errorHandlerResponser);

//log error handler
const { logErrorResponses } = require("./src/_helpers/logger/winstonLogger");
app.use(logErrorResponses);


console.info("App Started.....")

module.exports = app;
