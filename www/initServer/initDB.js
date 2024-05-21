const mongoose = require("mongoose");
const {systemLogger} = require('./initSysLogger')

// Moved out of the function to be globally accessible
let db = null;
let collection = null;

const atlasConnectionString = process.env.MONGODB_URI
const localConnectionString = 'mongodb://localhost:27017/jamal'; // Local fallback connection string
const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,

};


const dbConnect = async () => {
	try {
		systemLogger.info("Trying to connect to Atlas MongoDB...");
		await mongoose.connect(atlasConnectionString, connectionOptions);
		systemLogger.info("Connected to Atlas MongoDB successfully.");
		const result = await mongoose.connection.db.listCollections().toArray();
		const arr = result.map((item) => item.name)
		return arr

		
	} catch (error) {
		systemLogger.error(`Failed to connect to MongoDB Atlas due to error: ${error.message}`);
		try {
			systemLogger.info("Trying to connect to Local MongoDB...");
			await mongoose.connect(localConnectionString, connectionOptions);
			systemLogger.info("Connected to local MongoDB successfully.");
		} catch (localError) {
			systemLogger.error(`Failed to connect to local MongoDB due to error: ${localError.message}`);
			throw localError;  // Throw the error to handle it elsewhere or log it
		}

	}
};


db = mongoose.connection;
db.on("connected", () => {
	systemLogger.info("Database Connected  Successfully.");
});
db.on("open", async () => {
	systemLogger.info("Database Now Open to Use.");
	// collection = await listCollections(); // Ensure this call is correct
	// console.log("Collections:", collection);
});
db.on("error", (err) => {
	systemLogger.error("Error While Connecting to Database");
});
db.on("disconnected", () => {
	systemLogger.error("MongoDB Connection Disconnected");
});
db.on("close", () => {
	systemLogger.error("Closed Database Connection Successfully");
});




// Correct function definition
const listCollections = async () => {
	try {
		const result = await mongoose.connection.db.listCollections().toArray();
		const arr = result.map((item) => item.name)
		return arr

	} catch (err) {

		return [];
	}
};

// Correct export statement

const closeDB = async () => {
	if (db) {
		await mongoose.connection.close();
		systemLogger.info("MongoDB Disconnected...");
	} else {
		systemLogger.info("No Connection to Close...");
	}
};

module.exports = { dbConnect, closeDB, listCollections }; // Corrected export statement
