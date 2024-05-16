
const nodemailer = require("nodemailer");
const catchAsync = require('../middleware/catchAsync')

const sendMail = async(toEmail, subject, html)=> {
	try {
		let transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: Number(process.env.MAIL_PORT),
			secure: Boolean(process.env.MAIL_SECURE), 
			auth: {
				user: process.env.MAIL_USER_NAME, 
				pass: process.env.MAIL_PASS 
			},
		});
	
		// eslint-disable-next-line no-unused-vars
		let info = await transporter.sendMail({
			from: process.env.MAIL_FROM_EMAIL, 
			to: toEmail, 
			subject:subject, 
			// text: "Hello world?", 
			html: html, 
		});
	} catch (error) {
		throw new Error("Email Service Unavailable")
	}
	
};

module.exports = sendMail;