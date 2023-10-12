class ResponseHandler {
  /**
   * Create a static method to handle success response
   * @param {Object} res - The response object
   * @param {Object} data - The data to send in the response
   * @param {string} message - A message to include in the response
   * @param {number} code - The HTTP status code (default is 200)
   */
  static success(res, message = "Success", data, code = 200) {
    return res.status(code).json({
      status: "success",
      message,
      data,
    });
  }

  /**
   * Create a static method to handle error response
   * @param {Object} res - The response object
   * @param {string} error - The error message
   * @param {number} code - The HTTP status code (default is 500)
   */
  static error(res, error, code = 500) {
    return res.status(code).json({
      status: "error",
      error,
      code,
    });
  }
}

module.exports = ResponseHandler;
