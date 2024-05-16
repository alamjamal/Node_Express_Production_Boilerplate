const mongoose = require("mongoose");


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
		console.log("Trying to connect to Atlas MongoDB...");
		await mongoose.connect(localConnectionString, connectionOptions);
		console.log("Connected to Atlas MongoDB successfully.");
		const result = await mongoose.connection.db.listCollections().toArray();
		const arr = result.map((item) => item.name)
		return arr

		
	} catch (error) {
		console.log(`Failed to connect to MongoDB Atlas due to error: ${error.message}`);
		try {
			console.log("Trying to connect to Local MongoDB...");
			await mongoose.connect(localConnectionString, connectionOptions);
			console.log("Connected to local MongoDB successfully.");
		} catch (localError) {
			console.log(`Failed to connect to local MongoDB due to error: ${localError.message}`);
			throw localError;  // Throw the error to handle it elsewhere or log it
		}

	}
};


db = mongoose.connection;
db.on("connected", () => {
	console.log("Database connection successful.");
});
db.on("open", async () => {
	console.log("Database open.");
	// collection = await listCollections(); // Ensure this call is correct
	// console.log("Collections:", collection);
});
db.on("error", (err) => {
	console.log("Error while connecting to database");
});
db.on("disconnected", () => {
	console.log("MongoDB connection disconnected");
});
db.on("close", () => {
	console.log("Closed connection to database successfully");
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
		console.log("MongoDB Disconnected...");
	} else {
		console.log("No connection to close...");
	}
};

module.exports = { dbConnect, closeDB, listCollections }; // Corrected export statement
