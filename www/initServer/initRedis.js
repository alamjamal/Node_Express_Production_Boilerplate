const redis = require("redis");
const {systemLogger} = require('./initSysLogger')
const redisClient = redis.createClient();
// redisClient.connect();

const redisConnect = async () => {
    try {
        await redisClient.connect();
        systemLogger.info("Redis Connected Successfully")
    } catch (err) {
        systemLogger.error("Error While Connecting Redis")
    }
    
}

// redisClient.on('connect', () => console.log('Connected to Redis DB'));

// (async () => {  client.on('error', (err) => console.log('Redis Client Error', err)); })();

// (async () => { await redisClient.connect() })();

// isOpen will return True here as the client's socket is open now.
// isReady will return True here, client is ready to use.

// redisClient.on('connect', () => console.log('Connected to Redis DB'));
// redisClient.on('ready', () => console.log('Ready to use Redis DB'));
// redisClient.on('end', () => console.log('Client disconnected from Redis DB'));

(async () => {  redisClient.on('connect', () =>  systemLogger.info('Connected to Redis DB')); })();
(async () => {  redisClient.on('ready', () =>  systemLogger.info('Ready to use Redis DB')); })();
(async () => {  redisClient.on('end', () =>  systemLogger.info('Client disconnected from Redis DB')); })();

// process.on('SIGINT', async () => {
//     await redisClient.disconnect();
//     console.log('Client Closed from Redis DB')
//     process.exit(0)
// });


module.exports = {redisConnect, redisClient};