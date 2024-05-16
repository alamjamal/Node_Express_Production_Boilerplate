const httpStatus = require('http-status')
function sendResponse(res, status, message = httpStatus[`${status}_NAME`], data=[]) {
  let sanitizeData = !data  ? [] : Array.isArray(data) ? [...data]:[data]
  const payload = {
    message: message,
    data: sanitizeData
  }
  res.status(status).json(payload);
}

module.exports = sendResponse;