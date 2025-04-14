import {User} from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { catchAsyncErrors} from '../Middlewares/catchAsyncErrors.js';
import {v2 as cloudinary} from 'cloudinary';

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({accountVerified: true});
    res.status(200).json({
        success: true,
        users,
    });
});

export const registerNewAdmin = catchAsyncErrors(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler('Please upload a file',400));
    }
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return next(new ErrorHandler('Please fill all the fields',400));
    }
    const isRegistered = await User.findOne({email, accountVerified: true});
    if(isRegistered){
        return next(new ErrorHandler('User already registered',400));
    } 
    if(password.length < 8 || password.length > 20){
        return next(new ErrorHandler('Password must be between 8 and 20 characters',400));
    }
    const {avatar} = req.files;
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if(!allowedFormats.includes(avatar.mimetype)){
        return next(new ErrorHandler('Please upload a valid image file',400));
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
       folder: "LIBRARY_MANAGEMENT_SYSTEM_AVATARS",
    })
    if(!cloudinaryResponse || !cloudinaryResponse.error){
        console.error("console.error", cloudinaryResponse.error|| "Unknown error occurred while uploading to cloudinary");
        return next(new ErrorHandler('Error occurred while uploading to cloudinary',400));
    }
  const admin = await User.create({
        name,
        email,
        password: hashPassword,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    });
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        admin,
})
});