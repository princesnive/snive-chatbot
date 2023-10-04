class ResponseHandler {
  constructor(res, status, error, message, data) {
    this.res = res;
    this.status = status;
    this.error = error;
    this.message = message;
    this.data = data;
  }

  sendResponse() {
    const response = {
      status: this.status,
      error: this.error,
      message: this.message,
      data: this.data,
    };

    this.res.status(this.error ? 500 : 200).json(response);
  }
}

module.exports = ResponseHandler;
