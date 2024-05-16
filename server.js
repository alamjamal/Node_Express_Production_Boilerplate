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
  console.log(`Environment file ${envFilePath} not found, loading from process.env`);
}



const { mongoBackup } = require("./src/_helpers/dbBackup");
const { dbConnect, closeDB , listCollections} = require("./initServer/initDB");
const { redisConnect, redisClient } = require("./initServer/initRedis");
const {createDirectory} = require('./initServer/initDirectory')


// */5 * * * * *
// 0 0 * * *
const cron = require("node-cron");
cron.schedule('0 0 * * *', async () => {
  try {
    const collections =  await listCollections()
    await mongoBackup(collections);
  } catch (error) {
    console.error("Hi Failed to perform backup:", error);

  }
});

if (process.env.NODE_ENV === "production") {
  process.on("uncaughtException", (err) => {
    console.log(err.name, err.message, err.stack);
    console.log("Uncaught Exception occurred! Shutting down...");
    process.exit(0); // clean exit
  });
}

// await dbConnect();
// await connectRedis();
// await mongoBackup() //test backup is working or not


let server

(async () => {
  try {
    console.log("Initializing Server Setup......")
    await createDirectory()
    await redisConnect()
    const collections = await dbConnect()
    // await mongoBackup(collections)
    const app = require("./app");
    server = app.listen(process.env.NODE_PORT)
    server.on("listening", () => {
      console.log(`Server PORT ==> ${process.env.NODE_PORT}`);
      console.log("Node ENV ==> ", process.env.NODE_ENV);
      console.log("Node Version ==> ", process.version);
    });
    // Event handler for server error
    server.on("error", async (err) => {
      console.log("Express Server Error");
      await closeDB()
      await redisClient.disconnect()
      console.log(err)
      server.close();
    });

    // Event handler for server close
    server.on("close", async () => {
      console.log("Server closed");
      process.exit(0)
    });

    process.on("SIGINT", () => {
      server.close();
    });

  } catch (error) {
    console.error(error);
    process.exit(1)
  }
})()





process.on("unhandledRejection", async (err) => {
  console.log(err.name, err.message, err.stack);
  console.log("Unhandled rejection occurred! Shutting down...");
  process.exit(0)

});

