const runScript = require("./runScript");
// const { listCollections } = require("../../initServer/initDB"); // Make sure this path is correct
const {directoryPath} = require('../www/initServer/initDirectory')
const fs = require("fs");
const {systemLogger} = require('../www/initServer/initSysLogger')

async function mongoBackup(listCollections) {
	try {
		const collections = listCollections// This should return ['users', 'tokens']
		if (collections.length === 0) return
		systemLogger.info(`Backing Up Collections => ${collections}`)
		const promises = collections.map(collectionName => {
			const db = "jamal"; // Database name as a constant
			const outputPath = `${directoryPath.DB_DIRECTORY}/${collectionName}.json`;
			return runScript("mongoexport", [`--db=${db}`, `--collection=${collectionName}`, `--out=${outputPath}`]);
		});


		// Using Promise.allSettled to handle each promise result separately

		const results = await Promise.allSettled(promises);
		results.forEach((result, index) => {
			if (result.status === 'fulfilled') {
				systemLogger.info(`✅ Successfully backed up collection: ${collections[index]}`);
			} else {
				systemLogger.error(`❌ Error backing up collection: ${collections[index]}`);
			}
		});

	} catch (error) {
		systemLogger.error(`❌ Backup Failed `);
	}
}
module.exports = { mongoBackup };
