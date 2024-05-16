const httpStatus = require('http-status')
class ApiError extends Error {
	constructor(statusCode, message, isOperational = true, stack = '') {
	  super(message);
	  this.statusCode = statusCode;
	  this.isOperational = isOperational;
	  this.statusMessage = httpStatus[`${statusCode}_NAME`]
	  if (stack) {
		this.stack = stack;
	  } else {
		Error.captureStackTrace(this, this.constructor);
	  }
	}
  }
  
  module.exports = {ApiError};
  