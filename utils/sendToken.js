const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken();

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message,
        user,
        token,
    });
};

export default sendToken;