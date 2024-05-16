const Joi = require("joi");

//without required means the payload can be present or not


const addressSchema = {
	pinCode: Joi.string().pattern(/^[1-9]{1}[0-9]{5}/).length(6).required().error(new Error("Provide Correct Pin Number")),
	localAddress: Joi.string().trim().min(5).max(100).required(),
	district: Joi.string().trim().min(2).max(20).required(),
	state: Joi.string().trim().min(2).max(20).required(),
};

const validateUser = Joi.object({
	//common
	roles: Joi.string().valid("FUser", "PUser").required("Roles is required").error(new Error("Provide Correct Roles")),
	firstName: Joi.string().min(1).max(50).required(),
	lastName: Joi.string().allow(""),
	userDP: Joi.string().allow(""),
	email: Joi.string().email().trim().alter({
		POST: (schema) => schema.required(),
		PUT: (schema) => schema.forbidden(),//not required to send payload for update
		PATCH: (schema) => schema.forbidden(),
	}),
	password: Joi.string().min(5).max(25).alter({
		POST: (schema) => schema.required(),
		PUT: (schema) => schema.forbidden(),
		PATCH: (schema) => schema.forbidden(),
	}),
	mobile: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required()
		.error(new Error("Provide Correct Mobile Number")),


	address: Joi.object().keys(addressSchema).required("Address is required").error(new Error("Provide Correct Address")),
		// .when("roles", { is: "Operator", then: Joi.forbidden() })
		// .when("roles", { is: "Client", then: Joi.required() })
		// .when("roles", { is: "User", then: Joi.required() })
});



const updateValidateUser=async(body, requestType)=>{
	const addressSchema= {
		pinCode: Joi.string().pattern(/^[1-9]{1}[0-9]{5}/).length(6).required().error(new Error("Provide Correct Pin Number")),
		localAddress: Joi.string().trim().min(5).max(100).required(),
		district: Joi.string().trim().min(2).max(20).required(),
		state: Joi.string().trim().min(2).max(20).required(),
	};

	const schema = Joi.object({
		firstName:Joi.string().min(1).max(50),
		lastName:Joi.string(),
		userDP:Joi.string(),
		mobile: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/)
			.error(new Error("Provide Correct Mobile Number")),
		address:  Joi.object().keys(addressSchema)
	});


	return schema.tailor(requestType).validate(body);
};

const logInValidation = Joi.object({
	email: Joi.string().email().required().label("Email"),
	password: Joi.string().required().label("Password"),
});


const refreshTokenValidation=async(body) =>{
	const schema = Joi.object({
		refreshToken: Joi.string().required().label("Refresh Token"),
	});
	return schema.validate(body);
};

const idOnlyValidation= async(body)=>{
	const schema = Joi.object({
		id: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required().label("id"),
	});
	return schema.validate(body);
};

const tokenOnlyValidation= Joi.object({
	token: Joi.string().trim().regex(/^[0-9a-fA-F]{24}[:]{3}[0-9a-zA-Z]{72}$/).required().error(new Error('Invalid Link'))
});

const emailOnlyValidation=  Joi.object({
	email: Joi.string().trim().email().required().label("email"),
});

const passwordOnlyValidation= Joi.object({
	password: Joi.string().required().min(5).max(25).label("password"),
});

// const paginationQuery= async (body)=>  {
// 	const schema = Joi.object({
// 		page: Joi.number().integer().min(1).max(100).default(1),
//         limit: Joi.number().integer().min(1).max(100).default(10),
// 	});
// 	return schema.validate(body);
// };

const paginationQuery = async (body)=>  {
	const schema = Joi.object({
		page: Joi.number().integer().min(1).max(100), //.default(1)
		limit: Joi.number().integer().min(1).max(100),
		search: Joi.string().min(1).max(100),
		userType: Joi.string().min(1).max(20),
		organisation: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/),
	});
	return schema.validate(body);
};

const idAndEmailValidation = Joi.object({
	id: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).allow().label("id").error(new Error("Invalid Id")),
	email: Joi.string().trim().email().allow().label("email"),
});



const schemaTest = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
	compressLevel:Joi.number().allow().min(10,'Min 10').max(100,'Max 100')
    // You might want to include preliminary checks for file properties that are available as text fields, if applicable
});


module.exports = {
	updateValidateUser,
	refreshTokenValidation,
	idOnlyValidation,
	paginationQuery,
	validateUser,
	logInValidation,
	tokenOnlyValidation,
	emailOnlyValidation,
	passwordOnlyValidation,
	idAndEmailValidation,
	schemaTest
};




