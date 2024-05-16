const roleCheck = (roles) => {
	return (req, res, next) => {
		if (roles.includes(req.user.roles)) {
			next();
		} else {
			res.status(403).json({ error: true, message: "You are not authorized" });
		}
	};
};

module.exports= roleCheck;
