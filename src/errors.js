const CustomError = require("custom-error-class");

exports.InvalidStateError = class InvalidStateError extends CustomError {};
exports.NetworkError = class NetworkError extends CustomError {};
exports.ResponseError = class ResponseError extends CustomError {};
