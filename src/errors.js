const CustomError = require("custom-error-class");

exports.InvalidStateError = class InvalidStateError extends CustomError {};
exports.NetworkError = class NetworkError extends CustomError {};
exports.RequestError = class RequestError extends CustomError {};
exports.ServerError = class ServerError extends CustomError {};
