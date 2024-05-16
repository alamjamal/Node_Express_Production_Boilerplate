const { User } = require("./user.model");
const { updateValidateUser} = require("./user.validate");
const { ApiError } = require('../../_helpers/errorHandler/apiError')
const httpStatus = require('http-status')
const sendResponse = require('../../_helpers/apiResponser')


const getCurrent = async(req, res)=> {
	const user = await User.findById(req.user.id);
	if (user) {
		sendResponse(res,httpStatus.OK,undefined,user)
	} else {
		sendResponse(res,httpStatus.NOT_FOUND,undefined,user)
	}
};

const updateCurrent = async(req, res)=>{
	const { error } = await updateValidateUser(req.body, req.method);
	if (error) throw new ApiError(httpStatus.BAD_REQUEST, error.message)
	const user = await User.findByIdAndUpdate(req.user.id,{...req.body}, { new: true })
	if (user) {
		sendResponse(res,httpStatus.OK,"User Updated Successfully",user)
	} else {
		sendResponse(res,httpStatus.NOT_FOUND,"User Not Found" ,user)
	}
};

const deleteCurrent =  async(req, res)=>{
	if (!req.user.id.match(/^[0-9a-fA-F]{24}$/))
		return res.status(400).json({ message: "Not a Valid id" });
	const user = await  User.findByIdAndRemove(req.user.id)
	if (user) {
		sendResponse(res,httpStatus.OK,"User Deleted Successfully" ,user)
	} else {
		sendResponse(res,httpStatus.NOT_FOUND,"User Not Found",user)
	}
};

const getAllUser = async(req, res)=>{
	const result = await User.find()
	if(Array.isArray(result) && result.length>0) {
		sendResponse(res,
			httpStatus.OK,
			undefined,
			result
		)
	}else{
		sendResponse(res,
			httpStatus.NOT_FOUND,
			undefined,
			result
		)
	}
}
module.exports = {
	getCurrent,
	updateCurrent,
	deleteCurrent,
	getAllUser
};