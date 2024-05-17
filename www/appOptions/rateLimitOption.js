const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const { redisClient } = require("../initServer/initRedis");
const httpStatus = require('http-status')


const defaultStore = new rateLimit.MemoryStore();

const rateLimiterSetup = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, in 15 minutes 100 request can come)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Use an external store for more precise rate limiting
	message: (req, res) => {
		res.status(200)
			.json({
				status: httpStatus.OK,
				message: `Too Many Request from this ${req.ip}, please try again after an hour`
			})
	},
	store: redisClient.isReady ? new RedisStore({
		sendCommand: (...args) => redisClient.sendCommand(args),
	}) : defaultStore

});

module.exports = rateLimiterSetup;