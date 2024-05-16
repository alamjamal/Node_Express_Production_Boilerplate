const Pagination = async (model, myQuery, requestQuery) => {
	const pageSize = parseInt(requestQuery.limit) || 10; // Default page size
	const page = parseInt(requestQuery.page) || 1; // Default page number
	const skip = (page - 1) * pageSize;

	const totalCount = await model.countDocuments(myQuery);
	const totalPages = Math.ceil(totalCount / pageSize);
	const data = await model.find(myQuery).skip(skip).limit(pageSize);

	return {
		page,
		pageSize,
		totalPages,
		totalCount,
		data,
	};
};

module.exports = Pagination;
