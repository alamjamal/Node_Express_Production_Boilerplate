const  extendTimeout = (req, res, next) => {
	res.setTimeout(480000, function () { 
		/* Handle timeout */ 
    
	});
	next();
};

module.exports = extendTimeout;