const { HTTP_STATUS_200, HTTP_STATUS_400 } = require("../utils/constants");

function success(
  res,
  { data = null, status = HTTP_STATUS_200, message = "Success." }
) {
  return res.status(status).json({ success: true, data, message });
}

function error(
  res,
  {
    status = HTTP_STATUS_400,
    code = "INTERNAL_ERROR",
    message = "Error",
    details = null,
  }
) {
  return res
    .status(status)
    .json({ success: false, data: null, message, code, details });
}

module.exports = { success, error };
