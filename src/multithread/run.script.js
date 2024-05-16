const { spawn } = require("child_process");
// This close event is different than the exit event because multiple 
// child processes might share the same stdio streams 
// and so one child process exiting does not mean that the streams got closed.
// exit fired after all process closed (better)


const runScript = function run_script(command, args) {
	return new Promise((resolve, reject) => {
		let child = spawn(command, args);
		let scriptOutput = "";

		child.stdout.setEncoding("utf8");
		child.stdout.on("data", function (data) {
			console.log("stdout: " + data);
			data = data.toString();
			scriptOutput += data;
		});

		child.stderr.setEncoding("utf8");
		child.stderr.on("data", function (data) {
			// console.log('stderr: ' + data);
			data = data.toString();
			scriptOutput += data;
		});

		child.on("close", function (code) {
			console.log("multithread closed 🦾", code);
		});

		child.on("error", (error) => {
			console.log("error from spawn page:", error);
			reject(error);
		});

		child.on("exit", (code, signal) => {
			if (code) reject(`Process exit with code: ${code}`);
			else if (signal) reject(`Process killed with signal:  ${signal}`);
			else resolve(scriptOutput);
		});

	});
};



// A child process stdin is a (writable) stream. We can use it to send a command some input. 
// Just like any writable stream, 
// the easiest way to consume it is using the pipe function. 
// (We simply pipe a (readable) stream into a (writable) stream.)
// Since the main process stdin is a (readable) stream, we can pipe that into a child process stdin stream. For example:

// const find = spawn('find', ['-name','mail.js', '-type', 'f']);
// const process = require('process');

// readable.pipe(writable)
// process.stdin.pipe(find.stdin)

// find.stdout.on('data', (data) => {
//   console.log(`child stdout:\n${data}`);
// });


// We can use it to send a command some input. 
// const find = spawn('find', ['.', '-type', 'f']);
// const wc = spawn('wc', ['-l']);

// find.stdout.pipe(wc.stdin);

// wc.stdout.on('data', (data) => {
//   console.log(`Number of files ${data}`);
// });




module.exports = runScript;
