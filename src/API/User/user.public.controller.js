/* eslint-disable no-useless-escape */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, UserHash, UserToken } = require("./user.model");
const { format, differenceInSeconds, differenceInMinutes } = require('date-fns');
// const User = db.User;
const { accountVerification, passwordReset } = require("../../_helpers/htmlTemplate/emailTemplates");
const sendMail = require("../../_helpers/mail");
const { generateAccessToken, generateRefreshToken, verifyToken } = require("../../_helpers/jwtHelper");
const crypto = require("crypto");
const fs = require("fs");
const { ApiError } = require('../../_helpers/apiError')
const httpStatus = require('http-status')
const sendResponse = require('../../_helpers/apiResponser')
const { calculateRemainingMS } = require('../../_helpers/commonFn')
const {directoryPath} = require('../../../www/initServer/initDirectory')
async function register(req, res) {
	let { email, password } = req.body;
	let user = await User.findOne({ email: email });
	if (user) {
		if (user.isActivate) throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Registered")
		const hash = await UserHash.findOne({ userId: user._id });
		if (hash) {
			const { minutes, seconds } = calculateRemainingMS(hash.expireAt)
			throw new ApiError(httpStatus.BAD_REQUEST, `Link Already Sent Wait ${minutes}:${seconds} To Resend`)
		} else {
			throw new ApiError(httpStatus.BAD_REQUEST, "Link Expired Please Resend ")
		}
	}
	password = bcrypt.hashSync(password, 10);
	user = await new User({ ...req.body, password: password }).save();
	// const hashString = bcrypt.hashSync(Math.random().toString(36).slice(2, 10), 10).replace(/\//g, "$");
	const hashString = crypto.randomBytes(36).toString('hex');
	const hashData = await new UserHash({
		userId: user.id,
		hashString: hashString,
		createdAt: Date.now(),
		expireAt: Date.now() + 10 * 60 * 1000,
	}).save();
	const sendToken = { id: user.id, hashString: hashString };
	const output = accountVerification(sendToken);

	try {
		await sendMail(user.email, "Account Verification", output)
		sendResponse(res,
			httpStatus.OK,
			"Account Verification Link Sent To Your Mail Id, Kindly Check Your Account",
			{
				sentTime: format(hashData.createdAt, 'dd/MM/yyyy HH:mm:ss'),
				expireAt: format(hashData.expireAt, 'dd/MM/yyyy HH:mm:ss')
			}
		)

	} catch (error) {
		user.remove()
		hashData.remove();
		throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, error.message)
	}

	// return res.status(200).json({ message: "Register" });
}

async function resendLink(req, res) {
	const { id, email } = req.body;
	let user = await User.findOne({ $or: [{ _id: id }, { email: email }] });
	if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User Not Found")
	if (user) {
		if (user.isActivate) throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Verified")
		const hash = await UserHash.findOne({ userId: user.id });
		if (hash) {
			const { minutes, seconds } = calculateRemainingMS(hash.expireAt)
			throw new ApiError(httpStatus.BAD_REQUEST, `Link Already Sent Wait  ${minutes}:${seconds}  To Resend`)
		}
	}
	const hashString = crypto.randomBytes(36).toString('hex');
	const hashData = await new UserHash({
		userId: user.id,
		hashString: hashString,
		createdAt: Date.now(),
		expireAt: Date.now() + 10 * 60 * 1000,
	}).save();
	const sendToken = { id: user.id, hashString: hashString };
	const output = accountVerification(sendToken);
	try {
		await sendMail(user.email, "Account Verification via Resend", output)
		sendResponse(res,
			httpStatus.OK,
			"Account Verification Link Sent To Your Mail Id, Kindly Check Your Account",
			{
				sentTime: format(hashData.createdAt, 'dd/MM/yyyy HH:mm:ss'),
				expireAt: format(hashData.expireAt, 'dd/MM/yyyy HH:mm:ss')
			}
		)
	} catch (error) {
		hashData.remove();
		throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, "Email Service Unavailable")
	}
}

async function activateAccount(req, res) {
	const token = req.body.token;
	const [id, hashString] = token.split(":::");
	let user = await User.findById(id);
	if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User Not Found")
	if (user.isActivate) throw new ApiError(httpStatus.ALREADY_REPORTED, "Already Activated")
	const hash = await UserHash.findOne({ userId: user.id, hashString: hashString, });
	if (!hash) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Token Expired Please Resend Link")
	let isApproved = true;
	user = await User.findByIdAndUpdate(user._id, { isActivate: true, isApproved: isApproved }, { new: true }).exec();
	if (hash) await hash.remove();
	sendResponse(res,
		httpStatus.OK,
		"Account Activated Successfully",
		user
	)
}


async function forgotPassword(req, res) {
	const email = req.body.email;
	const user = await User.findOne({ email });
	if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User Not Found")
	if (!user.isActivate) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "User Not Activated Their Account")
	const hash = await UserHash.findOne({ userId: user._id });
	if (hash) {
		const { minutes, seconds } = calculateRemainingMS(hash.expireAt)
		throw new ApiError(httpStatus.BAD_REQUEST, `Link Already Sent Wait  ${minutes}:${seconds}  To Resend`)
	}
	const hashString = crypto.randomBytes(36).toString('hex');
		const hashData = await new UserHash({
		userId: user.id,
		hashString: hashString,
		createdAt: Date.now(),
		expireAt: Date.now() + 10 * 60 * 1000,
	}).save();
	const token = { id: user.id, hashString: hashString };
	const output = passwordReset(token);
	try {
		await sendMail(user.email, "Change Password", output)
		sendResponse(res,
			httpStatus.OK,
			"Change Password Link Sent To Your Mail Id, Kindly Check Your Account",
			{
				sentTime: format(user.createdAt, 'dd/MM/yyyy HH:mm:ss'),
				expireAt: format(Date.now() + 10 * 60 * 1000, 'dd/MM/yyyy HH:mm:ss')
			}
		)

	} catch (error) {
		hashData.remove();
		throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, "Email Service Unavailable")
	}

}

async function forgotPasswordLink(req, res) {
	const [id, hashString] = req.params.token.split(":::");
	const hash = await UserHash.findOne({ userId: id, hashString: hashString });
	if (!hash) throw new ApiError(httpStatus.BAD_REQUEST, "Token Expired Please Resend Link")
	res.sendStatus(200)
}

async function changePassword(req, res) {
	const [id, hashString] = req.params.token.split(":::");
	const hash = await UserHash.findOne({ userId: id, hashString: hashString });
	if (!hash) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Token Expired Please Resend Link")
	let password = req.body.password;
	password = bcrypt.hashSync(password, 10);
	const updateUser = await User.findByIdAndUpdate(id, { password: password }, { new: true })
	await hash.remove();
	sendResponse(res,
		httpStatus.OK,
		"Password Changed Successfully",
		updateUser
	)

}


async function resendLinkPassword(req, res) {
	
	const { id, email } = req.body;
	let user = await User.findOne({ $or: [{ _id: id }, { email: email }] });
	if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User Not Found")
	if (!user.isActivate) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "User Not Activated Their Account")
	const hash = await UserHash.findOne({ userId: user._id });
	if (hash) {
		const { minutes, seconds } = calculateRemainingMS(hash.expireAt)
		throw new ApiError(httpStatus.BAD_REQUEST, `Link Already Sent Wait  ${minutes}:${seconds}  To Resend`)
	}
	const hashString = crypto.randomBytes(36).toString('hex');
	const hashData = await new UserHash({
		userId: user.id,
		hashString: hashString,
		createdAt: Date.now(),
		expireAt: Date.now() + 10 * 60 * 1000,
	}).save();
	const token = { id: user.id, hashString: hashString };
	const output = passwordReset(token);
	try {
		await sendMail(user.email, "Password Reset via resend", output)
		sendResponse(res,
			httpStatus.OK,
			"Password Reset Link Sent To Your Mail Id, Kindly Check Your Account",
			{
				sentTime: format(user.createdAt, 'dd/MM/yyyy HH:mm:ss'),
				expireAt: format(Date.now() + 10 * 60 * 1000, 'dd/MM/yyyy HH:mm:ss')
			}
		)

	} catch (error) {
		hashData.remove();
		throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, "Email Service Unavailable")
	}

}



async function login(req, res) {
	const { email, password } = req.body;
	const user = await User.findOne({ email: email })
	if (user && bcrypt.compareSync(password, user.password)) {
		if (!user.isActivate) throw new ApiError(httpStatus.FORBIDDEN, "Activate Your Account")
		if (!user.isApproved) throw new ApiError(httpStatus.FORBIDDEN, "Contact Admin To Approve Your Account")
		const passCode = crypto.randomBytes(16).toString("hex");
		const accessToken = await generateAccessToken(user);
		const refreshToken = await generateRefreshToken(user);
		res.cookie('accessToken', accessToken, {
			httpOnly: true, //accessible only by web server 
			secure: true, //https
			sameSite: 'None',
			maxAge: 10 * 60 * 1000 //cookie expiry: set to match at
		});
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true, //accessible only by web server 
			secure: true, //https
			sameSite: 'None',
			maxAge: 15 * 60 * 1000 //cookie expiry: set to match rt,
		})
		sendResponse(res,
			httpStatus.OK,
			"Login Successful",
			{ ...user.toJSON(), passCode }
		)
	}
	else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Username or Password is Incorrect",)
	}
}


async function getAccessToken(req, res, next) {
	//here we need refresh token to give access token
	// the refresh token is max time  a user can keep logged in system 
	const cookies = req.cookies
	if (!cookies?.refreshToken) throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Access Denied: No token provided')
	const refreshToken = cookies.refreshToken
	const { tokenDetails } = await verifyToken(refreshToken)
	const user = { id: tokenDetails._id, ...tokenDetails };
	//we need to generate access token with the details of refresh token
	const accessToken = await generateAccessToken(user);
	res.cookie('accessToken', accessToken, {
		httpOnly: true, //accessible only by web server 
		secure: true, //https
		sameSite: 'None',
		maxAge: 10 * 60 * 1000 //cookie expiry: set to match at
	});
	res.sendStatus(200)
}

async function logout(req, res) {
	res.clearCookie('accessToken', {
		httpOnly: true,
		sameSite: 'None',
		secure: true
	})
	res.clearCookie('refreshToken', {
		httpOnly: true,
		sameSite: 'None',
		secure: true
	})
	// const userToken = await UserToken.findOne({ token: req.body.refreshToken });
	// if (!userToken) return res.status(200).json({ error: false, message: "No Refresh Token Found" });
	// await userToken.remove();
	res.sendStatus(200)
}



const videoPlay = async (req, res) => {
	// Ensure there is a range given for the video
	try {
		const range = req.headers.range;
		if (!range) throw new ApiError(httpStatus.BAD_REQUEST, "Requires Range header")
		const videoPath = directoryPath.CONTENT_VIDEO_DIRECTORY + "/" + req.params.id;

		const videoSize = fs.statSync(videoPath).size;


		// Parse Range
		// Example: 'bytes=6750208-'
		const CHUNK_SIZE = 1 * 1e6; // ~500 KB => 500000 Bytes
		const start = Number(range.replace(/\D/g, ""));// 'bytes=6750208-' => 6750208
		const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

		// Create headers
		const contentLength = end - start + 1;
		const headers = {
			"Content-Range": `bytes ${start}-${end}/${videoSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": contentLength,
			"Content-Type": "video/webm video/mp4",
		};

		// HTTP Status 206 for Partial Content
		res.writeHead(206, headers);

		// create video read stream for this particular chunk
		const videoStream = fs.createReadStream(videoPath, { start, end });

		// Stream the video chunk to the client
		videoStream.pipe(res);
	} catch (error) {
		if (error.code === "ENOENT") throw new ApiError(httpStatus.BAD_REQUEST, "File Not Found")
		throw new ApiError(httpStatus.BAD_REQUEST, error.message)
	}
};

const ImageUpload = async (req, res) => {
	const compressedImageSizeBytes = fs.statSync(req.compressedFilePath).size;
	let compressedImageSize;
	if (compressedImageSizeBytes < 1024) {
		compressedImageSize = `${compressedImageSizeBytes} B`;
	} else if (compressedImageSizeBytes < 1024 * 1024) {
		compressedImageSize = `${(compressedImageSizeBytes / 1024).toFixed(2)} KB`;
	} else {
		compressedImageSize = `${(compressedImageSizeBytes / (1024 * 1024)).toFixed(2)} MB`;
	}
	sendResponse(res,
		httpStatus.OK,
		"Compressed Successfully",
		{ path: req.compressedFilePath, compressedImageSize: compressedImageSize }
	)

};

module.exports = {
	login,
	register,
	activateAccount,
	forgotPassword,
	forgotPasswordLink,
	changePassword,
	resendLink,
	getAccessToken,
	logout,
	resendLinkPassword,
	videoPlay,
	ImageUpload
};