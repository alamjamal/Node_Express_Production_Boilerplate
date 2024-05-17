const { ApiError } = require("../_helpers/apiError");
const httpStatus = require('http-status')
const fs = require('fs').promises
const Validator = (schema,validateParams=false) => (req, res, next) => {
	// const {error} = schema.validate(req.body);
	let error=null
	if(!validateParams){
		 error = schema.tailor(req.method).validate(req.body).error
	}else{
		error = schema.tailor(req.method).validate(req.params).error
	}
	if (error) {
		if (req.file) {
			fs.unlink(req.file.path)
		}
		throw new ApiError(httpStatus.NOT_ACCEPTABLE, error.message.replace(/\"/g, "") )
		// res.status(400).json(new ApiError(httpStatus.NOT_ACCEPTABLE," error.message"))
	} else {
		next();
	}

};

module.exports = Validator;