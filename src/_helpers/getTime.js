function displayTime(date = new Date()) {
	let str = "";

	let currentTime = date;
	let hours = currentTime.getHours();
	let minutes = currentTime.getMinutes();
	let seconds = currentTime.getSeconds();

	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	str = hours + ":" + minutes + ":" + seconds + " ";
	if (hours > 11) {
		str += "PM";
	} else {
		str += "AM";
	}
	return str;
}


module.exports = { displayTime };
