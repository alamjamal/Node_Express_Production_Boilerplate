
const devErrors = (res, error) => {
	res.status(error.statusCode).json({
		status: error.statusCode,
		message: error.message,
		stackTrace: error.stack,
		error: error.errors,
		path: error.value
	});
};

const castErrorHandler = (error) => {
	const value = `Invalid value for ${error.path}: ${error.value}!`;
	return value

};

const duplicateKeyErrorHandler = (error) => {
	const name = error.keyValue.name;
	const value = `${name}. Please use another name!`;
	return value

};

const validationErrorHandler = (error) => {
	const errors = Object.values(error.errors).map(val => val.message);
	const errorMessages = errors.join(". ");
	const value = `Databse Error: ${errorMessages}`;
	return value

};

const prodErrors = (res, error) => {
	if (error.isOperational || error.statusCode < 500) {
		res.status(error.statusCode).json({
			status: error.status,
			statusCode: error.statusCode,
			message: error.message,
			isCustomError: error.value,
			statusMessage: error.statusMessage,
		});
	} else {
		res.status(error.statusCode).json({
			status: "error",
			message: "Something went wrong! Please try again later.",
			isCustomError: error.value,
		});
	}
	// else{
	// 	res.status(500).json({
	// 		status: "error",
	// 		message: error.message,
	// 		isCustomError:error.value,
	// 	});
	// }
};

const errorHandlerResponser = (error, req, res, next) => {
	// console.log(error, req, res, next)
	error.statusCode = error.statusCode || 500;
	error.status = error.statusCode >= 500 ? "error" : "info";
	if (process.env.NODE_ENV === "development") {
		devErrors(res, error);
	} else if (process.env.NODE_ENV === "production") {
		// error.value=""
		if (error.name === "CastError") {
			error.value = castErrorHandler(error);
		}
		else if (error.name === "ValidationError") {
			error.value = validationErrorHandler(error);
		}
		else if (error.code === 11000) {
			error.value = duplicateKeyErrorHandler(error);
		} else {
			error.value = false
		}
		prodErrors(res, error);
		// devErrors(res, error);
	}
	next(error)
};


module.exports = { errorHandlerResponser };
