const idParamsValidator = (req, res, next) => {
  const { id } = req.params
  if (!id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(400).json({ message: "Not a Valid id" });
  next()
}

module.exports = idParamsValidator
