const jwt = require("jsonwebtoken");
const { ApiError } = require('../_helpers/apiError')
const httpStatus = require('http-status');
const catchAsync = require("./catchAsync");

const verifyOptions = {
	issuer: "SLMS",
	subject: "meity.csit@manuu.edu.in",
	audience: "edeekshaam.in",
	algorithm: "RS256"
};

const UserAuth = catchAsync(async (req, res, next) => {
	// const token = req.header("x-access-token");
	try {
		const cookies = req.cookies
		if (!cookies?.accessToken) throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Access Denied: No token provided')
		const token = cookies?.accessToken
		const tokenDetails = jwt.verify(token, process.env.ACCESS_TOKEN_PUBLIC_KEY, { verifyOptions });
		req.user = tokenDetails;
		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Access Denied: Invalid token')
		}
		throw error
	}
})


module.exports = {
	UserAuth,

};
