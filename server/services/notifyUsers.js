import cron from 'node-cron';//for sheduling and excuting tasks
import {Borrow} from '../models/borrowModel.js';//importing borrow model
export const notifyUsers = () =>{
    cron.schedule("*/30 * * * * * *",async ()=>{
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
            sendEmail({
                email: user.email,
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