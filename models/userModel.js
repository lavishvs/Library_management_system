import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        select: false,
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    accountVerified:{
        type: Boolean,
        default: false,
    },
    borrowedBooks:[
        {
            bookId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Borrow",
            },
            returned: {
                type: Boolean,
                default: false,
            },
            bookTitle: String,
            borrowedDate: Date,
            dueDate: Date,
        },
    ],
    avatar:{
        public_id:String,
        url:String,
    },
    verificationCode: Number,
    verificationCodeExpires: Date,
    resetPasswordToken: String,
    resetPasswordCodeExpires: Date,

},
{
    timestamps: true,
}
);

userSchema.methods.generateVerificationCode = function () {
   function generateRandomFiveDigitNumber(){
    const firstDigit = Math.floor(Math.random() * 9) + 1; // First digit cannot be 0
    const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Remaining 4 digits can be anything from 0 to 9999
    return parseInt(`${firstDigit}${remainingDigits}`, 10); // Combine the first digit and remaining digits to form a 5-digit number
   }
   const verificationCode = generateRandomFiveDigitNumber();
   this.verificationCode = verificationCode;
   this.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // Code expires in 10 minutes
   return verificationCode;
}

userSchema.methods.generateToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordCodeExpires = Date.now() + 10 * 60 * 1000; // Code expires in 10 minutes
    return resetToken;
}


export const User = mongoose.model("User", userSchema);

