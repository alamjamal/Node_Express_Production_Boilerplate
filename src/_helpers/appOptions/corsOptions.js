const cors = require("cors");

const allowedOrigins = [
	"https://www.alamjamal.me", "https://alamjamal.me", "https://test.alamjamal.me",
	"https://dev.alamjamal.me", "https://stage.alamjamal.me", "https://prod.alamjamal.me", 
	"https://dashboard.alamjamal.me","http://localhost:3000","http://localhost:3001","http://localhost:3002",
];

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,            //access-control-allow-credentials:true
	optionSuccessStatus: 200,
	allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization,x-access-token",
	methods: "GET,HEAD,PUT,POST,DELETE,OPTIONS,PATCH",
};

const corsSetup = cors(corsOptions)
module.exports =corsSetup ;