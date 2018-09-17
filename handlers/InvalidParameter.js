class InvalidParameter extends Error {
  constructor({ message, errorCode } = {}) {
    super();
    this.status = 400;
    this.message = message;
    this.errorCode = "invalid.request.parameters.".concat(errorCode);
  }
}

module.exports = InvalidParameter;
