const Joi = require("joi");


const paginationQuery = async (body)=>  {
	const schema = Joi.object({
		page: Joi.number().integer().min(1).max(100), //.default(1)
		limit: Joi.number().integer().min(1).max(100),
		search: Joi.string().min(1).max(100),
	});
	return schema.validate(body);
};

async function idOnlyValidation (body){
	const schema = Joi.object({
		id: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required().label("id"),
	});
	return schema.validate(body);
}



module.exports = {
	paginationQuery,
	idOnlyValidation,
};
