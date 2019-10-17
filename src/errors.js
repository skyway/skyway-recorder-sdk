const CustomError = require("custom-error-class");

// client errors
exports.AbortError = class AbortError extends CustomError {};
exports.InvalidStateError = class InvalidStateError extends CustomError {};
exports.NotSupportedError = class NotSupportedError extends CustomError {};

// server errors
exports.NetworkError = class NetworkError extends CustomError {};
exports.RequestError = class RequestError extends CustomError {};
exports.ServerError = class ServerError extends CustomError {};
