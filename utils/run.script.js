const { spawn } = require("child_process");
const {systemLogger} = require('../www/initServer/initSysLogger')

const runScript = function run_script(command, args) {
	return new Promise((resolve, reject) => {
		let child = spawn(command, args);
		let scriptOutput = "";

		child.stdout.setEncoding("utf8");
		child.stdout.on("data", function (data) {
			systemLogger.info("stdout: " + data);
			data = data.toString();
			scriptOutput += data;
		});

		child.stderr.setEncoding("utf8");
		child.stderr.on("data", function (data) {
			// systemLogger.info('stderr: ' + data);
			data = data.toString();
			scriptOutput += data;
		});

		child.on("close", function (code) {
			systemLogger.info("Spawn Closed 🦾");
		});

		child.on("error", (error) => {
			systemLogger.error(`Error From Spawn Page: ${error}`);
			reject(error);
		});

		child.on("exit", (code, signal) => {
			if (code) reject(`Process exit with code: ${code}`);
			else if (signal) reject(`Process killed with signal:  ${signal}`);
			else resolve(scriptOutput);
		});

	});
};


module.exports = runScript;
