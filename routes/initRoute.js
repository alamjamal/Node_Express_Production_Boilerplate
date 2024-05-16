const initRoutes = (app) => {
    app.set("trust proxy", 2);

	app.get("/", (req, res) => {
		//res.status(200).sendFile(__dirname+'/index.html')
		res.status(200).send("ok");
	});

	app.get("/ip", (req, res) => {
		res.status(200).json({ ip: req.ip });
	});

	app.get("/loaderio-c93eadeaa1ec42263ed305ad2758c112", (req, res) => {
		res.status(200).sendFile(__dirname+'/loaderio.txt')
	});

	app.get("/cloudFlareIP", (req, res) => {
		let client_ip;
		if (req.headers["cf-connecting-ip"] && req.headers["cf-connecting-ip"].split(", ").length) {
			let first = req.headers["cf-connecting-ip"].split(", ");
			client_ip = first[0];
		} else {
			client_ip = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.socket.remoteAddress;
		}
		res.status(200).json({ ip: client_ip });

	});

	app.get("/debug-sentry", function mainHandler(req, res) {
		throw new Error("2My first Sentry error!");
	});

}

module.exports={initRoutes}