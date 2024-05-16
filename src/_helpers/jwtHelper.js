const path = require("path");
const jwt = require("jsonwebtoken");
const { UserToken } = require("../API/User/user.model");


const {ApiError} = require('../_helpers/errorHandler/apiError')
const httpStatus  = require('http-status')


const signOptions = {
	issuer: "SLMS",
	subject: "alam@manuu.edu.in",
	audience: "slms.com",
	algorithm: "RS256"
};


const generateAccessToken = async (user, checkRefresh = true) => {
	try {
		const payload = { id: user.id, roles: user.roles, email: user.email };
		const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, { ...signOptions, expiresIn: "10m" });
		return Promise.resolve(accessToken);

	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Invalid token')
		}
		throw error
		
	}
};


const generateRefreshToken = async (user) => {
	try {
		const payload = { id: user.id, roles: user.roles, email: user.email };
		refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY, { ...signOptions, expiresIn: "15m" });
		return Promise.resolve(refreshToken);

	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Invalid token')
		}
		throw error
		
	}
};


const verifyToken = async (token) => {
	try {
		const tokenDetails = jwt.verify(token, process.env.REFRESH_TOKEN_PUBLIC_KEY);
		return Promise.resolve({ tokenDetails });
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Invalid token')
		}
		throw error
		
	}
};



module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
