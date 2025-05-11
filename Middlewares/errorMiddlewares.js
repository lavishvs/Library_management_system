export  class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}

export  const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if(err.code === 11000) {
        const statusCode = 400;
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, statusCode);
    }
    if(err.name === "JsonWebTokenError") {
        const statusCode = 400;
        const message = `Json Web Token is Invalid, Try Again`;
        err = new ErrorHandler(message, statusCode);
    }
    if(err.name === "TokenExpiredError") {
        const statusCode = 400;
        const message = `Json Web Token is Expired, Try Again`;
        err = new ErrorHandler(message, statusCode);
    }
    if(err.name === "CastError") {
        const statusCode = 400;
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, statusCode);
    }
    if(err.name === "NotFound") {
        const statusCode = 404;
        const message = `Resource not found`;
        err = new ErrorHandler(message, statusCode);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });

}
// throw new Error("Not Found", 404);

export default errorMiddleware;