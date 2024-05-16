
const { UserAuth } = require("../src/middleware/userAuth");


const mainRoutes = (app) => {
	
	// all  public api routes
	app.use("/users/public", require("../src/API/User/user.public.route"));


	//admin  route
	app.use("/users/private", UserAuth, require("../src/API/User/user.private.route"));


	app.all("*", (req, res) => {
		res.status(404).json({ message: "404! Page not found " });
	});

};
module.exports = {mainRoutes};