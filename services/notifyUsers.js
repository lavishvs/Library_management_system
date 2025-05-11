import { User } from '../models/userModel.js';
import cron from 'node-cron';//for sheduling and excuting tasks
import {Borrow} from '../models/borrowModel.js';//importing borrow model
import { sendEmail } from "../utils/sendEmail.js";
export const notifyUsers = () =>{
    cron.schedule("0 0 * * *",async ()=>{
       console.log(`Task is running every 1 minute at ${new Date().toLocaleTimeString()}`);
       try{
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const borrowers = await Borrow.find({
            duedate: {
                $lte: oneDayAgo,
            },
            returndate: null,
            notified: false,
        });
        console.log(`Task is running ${new Date().toLocaleTimeString()}`);
       for(const element of borrowers){
        if(element.user && element.user.email){
         await sendEmail({
                email: element.user.email,
                subject: "Book Due Date Reminder",
                message: `Dear ${user.name}, your borrowed book is overdue. Please return it as soon as possible.`,
            });
            element.notified = true;
            await element.save();
        }  
    }
       }catch(err){
        console.error("Error in notifyUsers:", err);
       }

});
}


export const removeUnverifiedUsers = () => {
    cron.schedule("0 0 * * * *", async () => {
        console.log(`Removing unverified users at ${new Date().toLocaleTimeString()}`);
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Find unverified users
            const unverifiedUsers = await User.find({
                accountVerified: false,
                createdAt: { $lte: oneDayAgo },
            });

            console.log(`Found ${unverifiedUsers.length} unverified users to remove.`);

            // Delete unverified users
            const result = await User.deleteMany({
                accountVerified: false,
                createdAt: { $lte: oneDayAgo },
            });

            console.log(`Removed ${result.deletedCount} unverified users.`);
        } catch (err) {
            console.error("Error in removeUnverifiedUsers:", err);
        }
    });
};