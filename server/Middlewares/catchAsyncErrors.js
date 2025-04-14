export const catchAsyncErrors = (func) => (req, res, next) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch((error) => {
            next(error);
        });
    }
};