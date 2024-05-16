const runScript = require("../multithread/run.script");
// const { listCollections } = require("../../initServer/initDB"); // Make sure this path is correct
const {directoryPath} = require('../../initServer/initDirectory')
const fs = require("fs");

async function mongoBackup(listCollections) {
	try {
		const collections = listCollections// This should return ['users', 'tokens']
		if (collections.length === 0) return
		console.log("backing up collections =>", collections)
		const promises = collections.map(collectionName => {
			const db = "jamal"; // Database name as a constant
			const outputPath = `${directoryPath.DB_DIRECTORY}/${collectionName}.json`;
			return runScript("mongoexport", [`--db=${db}`, `--collection=${collectionName}`, `--out=${outputPath}`]);
		});


		// Using Promise.allSettled to handle each promise result separately

		const results = await Promise.allSettled(promises);
		results.forEach((result, index) => {
			if (result.status === 'fulfilled') {
				console.log(`✅ Successfully backed up collection: ${collections[index]}`);
			} else {
				console.log(`❌ Error backing up collection: ${collections[index]}`);
			}
		});

	} catch (error) {
		console.log(`❌ Backup Failed `);
	}
}
module.exports = { mongoBackup };
