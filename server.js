require("rootpath")();
const path = require("path");
const fs = require('fs');
const dotenv = require('dotenv');


const env = process.env.NODE_ENV || 'development';
const envFilePath = path.join(__dirname, 'utils', `.env.${env}`) ;
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
} else {
  dotenv.config({path:path.join(__dirname,'.env')});
  systemLogger.info(`Environment file ${envFilePath} not found, loading from process.env`);
}



const { mongoBackup } = require("./utils/dbBackup");
const { dbConnect, closeDB , listCollections} = require("./initServer/initDB");
const { redisConnect, redisClient } = require("./initServer/initRedis");
const {createDirectory} = require('./initServer/initDirectory')
const {systemLogger} = require('./initServer/initSysLogger')

// */5 * * * * *
// 0 0 * * *
const cron = require("node-cron");
cron.schedule('0 0 * * *', async () => {
  try {
    const collections =  await listCollections()
    await mongoBackup(collections);
  } catch (error) {
    systemLogger.error(`Hi Failed to perform backup: ${error}`);

  }
});

if (process.env.NODE_ENV === "production") {
  process.on("uncaughtException", (err) => {
    systemLogger.error(`${err.name} : ${err.message} : ${err.stack}`);
    systemLogger.info("Uncaught Exception occurred! Shutting down...");
    process.exit(0); // clean exit
  });
}

// await dbConnect();
// await connectRedis();
// await mongoBackup() //test backup is working or not


let server

(async () => {
  try {
    systemLogger.info("Initializing Server Setup......")
    await createDirectory()
    await redisConnect()
    const collections = await dbConnect()
    // await mongoBackup(collections)
    const app = require("./app");
    server = app.listen(process.env.NODE_PORT)
    server.on("listening", () => {
      systemLogger.info(`Server PORT ==> ${process.env.NODE_PORT}`);
      systemLogger.info(`Node ENV ==>  ${process.env.NODE_ENV}`);
      systemLogger.info(`Node Version ==>${process.version}`);
      systemLogger.info(`Server PORT ==> ${process.env.NODE_PORT}`)
    });
    // Event handler for server error
    server.on("error", async (err) => {
      systemLogger.error("Express Server Error");
      await closeDB()
      await redisClient.disconnect()
      systemLogger.error(err)
      server.close();
    });

    // Event handler for server close
    server.on("close", async () => {
      systemLogger.info("Server closed");
      process.exit(0)
    });

    process.on("SIGINT", () => {
      server.close();
    });

  } catch (error) {
    systemLogger.error(error);
    process.exit(1)
  }
})()





process.on("unhandledRejection", async (err) => {
  systemLogger.error(`${err.name}: ${err.message} : ${err.stack}`);
  systemLogger.info("Unhandled rejection occurred! Shutting down...");
  process.exit(0)

});

