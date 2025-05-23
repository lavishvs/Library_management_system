import {ErrorHandler} from '../Middlewares/errorMiddlewares.js';
import {User} from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { catchAsyncErrors} from '../Middlewares/catchAsyncErrors.js';
import sendVerificationCode from '../utils/sendVerificationCode.js';
import { sendEmail } from '../utils/sendEmail.js';
import {generateForgotPasswordEmailTemplate} from '../utils/emailTemplates.js'
import sendToken from '../utils/sendToken.js';

export const register = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(new ErrorHandler('Please enter all fields', 400));
        }
       const validateEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
        
        if (!validateEmail(email)) {
            return next(new ErrorHandler('Invalid email format', 400));
        }
        const isRegistered = await User.findOne({ email, accountVerified: true });
        if (isRegistered) {
            return next(new ErrorHandler('User already registered', 400));
        }

        const registeredAttemptsByUser = await User.find({ email, accountVerified: false });
        if (registeredAttemptsByUser.length >= 5) {
            return next(new ErrorHandler('Too many registration attempts. Please try again later', 400));
        }

        if (password.length < 8 || password.length > 20) {
            return next(new ErrorHandler('Password must be between 8 and 20 characters', 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const verificationCode = newUser.generateVerificationCode();
        await newUser.save();
        sendVerificationCode(verificationCode, email, res);
    } catch (error) {
        next(error);
    }
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return next(new ErrorHandler('Please enter all fields', 400));
    }
    try {
        const userAllEntries = await User.find({ email, accountVerified: false }).select('+verificationCode').sort({ createdAt: -1 });
        
        if (userAllEntries.length === 0) {
            return next(new ErrorHandler('No user found', 404));
        }
        
        let user;
        
        if (userAllEntries.length > 1) {
            user = userAllEntries[0];
            await User.deleteMany({ _id: { $ne: user._id }, email, accountVerified: false });
        } else {
            user = userAllEntries[0];
        }
        
        console.log('OTP received:', otp);
        console.log('Verification code in DB:', User.verificationCode);

        if (!user.verificationCode) {
            return next(new ErrorHandler('Verification code is missing', 400));
        }
        
        if (user.verificationCode !== otp) {
            return next(new ErrorHandler('Invalid OTP', 400));
        }

        if (!user.verificationCodeExpires) {
            return next(new ErrorHandler('Verification code expiration time is missing', 500));
        }

        const currentTime = Date.now();
        const verificationCodeExpire = new Date(user.verificationCodeExpires).getTime();

        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler('OTP has expired', 400));
        }

        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save({ validateModifiedOnly: true });

        sendToken(user, 200, "Account verified successfully", res);

    } catch (error) {
        console.error('Error in verifyOTP:', error);
        return next(new ErrorHandler('Error verifying email', 500));
    }
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const{email , password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password', 400));
    }
    const user = await User.findOne({email,accountVerified: true}).select('+password');
    if(!user){
        return next(new ErrorHandler('Invalid email or password', 400));
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password', 400));
    }
    sendToken(user, 200,"Login successful" ,res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    if (!req.body.email) {
        return next(new ErrorHandler('Please enter email', 400));
    }

    const user = await User.findOne({ email: req.body.email, accountVerified: true });
    if (!user) {
        return next(new ErrorHandler("Invalid email", 400));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    console.log("Generated Reset Token (Unhashed):", resetToken);
    console.log("Hashed Reset Token:", user.resetPasswordToken);
    console.log("Reset Token Expiration:", user.resetPasswordExpire);

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    console.log("Reset Password URL:", resetPasswordUrl);

    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);
    try {
        await sendEmail({
            email: user.email,
            subject: "Bookworm Library Management system - Password Recovery",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    console.log("Token from URL (Unhashed):", req.params.token);
    console.log("Hashed Token from URL:", resetPasswordToken);
    
    const user = await User.findOne({
        resetPasswordToken:"<hashed_token>",
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        console.log("No user found with this token or token has expired.");
        console.log("Query Details:");
        console.log("Hashed Token:", resetPasswordToken);
        console.log("Current Time:", Date.now());
        return next(new ErrorHandler("Reset password token is invalid or has been expired.", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    if (req.body.password.length < 8 || req.body.password.length > 16 || req.body.confirmPassword.length < 8 || req.body.confirmPassword.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendToken(user, 200, "Password reset successful", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Current password is incorrect", 400));
    }

    if (newPassword.length < 8 || newPassword.length > 16 || confirmPassword.length < 8 || confirmPassword.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await sendToken(user, 200, "Password reset successful", res);
});