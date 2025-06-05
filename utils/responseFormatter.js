class ResponseFormatter {
  static success(data) {
    return {
      success: true,
      value: data,
      errorCode: "200"
    };
  }

  static error(errorCode, value = null) {
    return {
      success: false,
      value: value,
      errorCode: errorCode
    };
  }
}

module.exports = ResponseFormatter; 