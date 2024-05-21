/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const Sentry = require("@sentry/node");
const { systemLogger } = require('./www/initServer/initSysLogger')

// app.use(bodyParser.urlencoded({ limit: "5mb", extended: true, parameterLimit: 1000 }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "20mb", extended: true, parameterLimit: 1000 }));

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(cookieParser())


if (process.env.NODE_ENV === "production") {
	//setup cors
	const corsSetup = require("./www/appOptions/corsOptions");
	app.use(corsSetup);

	// set security HTTP headers
	const helmetSetup = require("./www/appOptions/helmetOption");
	app.use(helmetSetup);

	//enable compression
	const compressionSetup = require('./www/appOptions/compressionOption')
	app.use(compressionSetup);

	//rate the limit 
	const rateLimiterSetup = require("./www/appOptions/rateLimitOption");
	app.use(rateLimiterSetup);


	//setup sentry
	const { initSentry } = require('./www/initServer/initSentry')
	initSentry(app);
	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());


}

//log request handler
const { morgonLogger } = require("./www/logger/morgonLogger");
app.use(morgonLogger)

//setup routes
const { setupAllRoutes } = require('./routes/index')
setupAllRoutes(app)



app.use(Sentry.Handlers.errorHandler());



//response error handler
const { errorHandlerResponser } = require("./www/errorHandler/errorHandler");
app.use(errorHandlerResponser);

//log error handler
const { logErrorResponses } = require("./www/logger/winstonLogger");
app.use(logErrorResponses);


systemLogger.info("App Started.....")

module.exports = app;
