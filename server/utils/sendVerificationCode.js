import { generateVerificationCodeMessage } from "./emailTemplates.js"; 
import { sendEmail } from "./sendEmail.js";
export async function sendVerificationCode(verificationCode,email, res) {
    try{
        const message = generateVerificationCodeMessage(verificationCode);
        sendEmail({
            email,
            subject: "Verification Code (Bookworm Library Management system)",
            message,
        });
        return res.status(200).json({
            success: true,
            message: `Verification code sent to ${email}`,
        });
    }catch(error){
        return res.statuds(500).json({
            sucess: false,
            message: "Verification code not sent",
        })
    }
}

export default sendVerificationCode;