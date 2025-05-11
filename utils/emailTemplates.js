export function generateVerificationCodeMessage(verificationCode) {
    return `
    <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
    <h2 style="color: #333;">Welcome to Bookworm Library Management System!</h2>
    <p style="font-size: 16px; color: #555;">Your verification code is:</p>
    <p style="font-size: 16px; color: #cccc;">Dear User,</p>
    <p style="text_align: center; margin: 20px 0;" > To complete your registration, please enter the following verification code:</p>
    <div style="background-color: #fff; border: 1px solid #ccc; padding: 20px; text-align: center; font-size: 24px; color: #333; width: 100px; margin: 0 auto;">
    <span style="font-size: 24px; font-weight: bold; color: #333;">${verificationCode}</span>    
    </div>
    <p style="font-size: 16px; color: #555;">This code is valid for 10 minutes.</p>
    <p style="font-size: 16px; color: #555;">Please do not share this code with anyone.</p>
    <p style="font-size: 16px; color: #555;">If you did not request this verification code, please ignore this email.</p>
    <footer style="margin-top: 20px; font-size: 14px; color: #777;">
        <p style="margin: 0;">Thank you for using our service!</p>
        <p style="margin: 0;">Best regards,</p>
        <p style="margin: 0;">Bookworm Library Management System Team</p>
    </footer>
    <div>
    `
}

export function generateForgotPasswordEmailTemplate(resetPasswordUrl){
    return `
    <>
    <div style="font-family: Arial, sans-serif; line-height: 1.6, max-width: 600px,margin: 0 auto, padding: 20px, background-color: #f4f4f4, border-radius: 5px, box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
     <h2 style="color: #333,text-align: center, font-size: 24px, font-weight: bold, margin-bottom: 20px;">Reset Your Password</h2>
     <p style="font-size: 16px; color: #555;">We have received a request to reset the password for your account.</p>
     <p style="font-size: 16px; color: #555;">Please click the button below to reset your password:</p>
     <div style="text-align: center; margin-top: 20px;">
        <a href="${resetPasswordUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
     </div>
     <p style="font-size: 16px; color: #555;">If you did not request a password reset, please ignore this email.</p>
     <p style="font-size: 16px; color: #555;">If the button above doesn't work, copy and paste the following link into your browser:</p>
     <p style="font-size: 16px; color: #555;">${resetPasswordUrl}</p>
     <p style="font-size: 16px; color: #555;">Thank you for using our service!</p>
     <p style="font-size: 16px; color: #555;">Best regards,</p>
    </div>
    </>
    `
}