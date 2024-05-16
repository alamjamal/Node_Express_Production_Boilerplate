// const { redisConnect } = require("../_helpers/init.redis");
// const redisClient = redisConnect();

const {redisClient} = require("../_helpers/redisConnect");


// Middleware to cache data using Redis
const cacheMiddleware = async (req, res, next) => {
	try {

		if (redisClient.isReady) {
			const cacheKey = req.originalUrl; // You can adjust the cache key based on your needs
			const data = await redisClient.get(cacheKey);
			if (data !== null) {
				console.log("Data retrieved from Redis cache");
				return res.json(JSON.parse(data));
			}

			// If data not found in cache, proceed with the route handling
			res.sendResponse = res.send;
			res.send = async (body) => {
				await redisClient.set(cacheKey, body); // Cache data for 1 hour (3600 seconds)
				await redisClient.expire(cacheKey, 3600);
				res.sendResponse(body);
			};

		}

		next();
	} catch (err) {
		console.error("Error retrieving data from Redis:", err);
		next(err);
	}
};

const deleteKeysMiddleware = async (req, res, next) => {
	try {

		if (redisClient.isReady) {
			const deleteKey = `*${req.originalUrl}*`
			const keys = await redisClient.keys(deleteKey);
			if (keys.length === 0) {
				next();
			}

			// Deleting keys
			const del = await redisClient.del(keys);
			console.log(`${del} keys deleted`);
		}

		next();
	}
	catch (error) {
		console.log(error);
	}
};

const deleteKeysFunction = async (pattern) => {
	try {
		if (redisClient.isReady) {
			const keys = await redisClient.keys(pattern);
			if (keys.length === 0) {
				return;
			}

			// Deleting keys
			const del = await redisClient.del(keys);
			console.log(`${del} keys deleted`);
		}

		return;

	}
	catch (error) {
		console.log(error);
	}
};


module.exports = { cacheMiddleware, deleteKeysMiddleware, deleteKeysFunction };