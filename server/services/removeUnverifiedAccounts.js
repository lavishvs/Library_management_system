import cron from 'node-cron'; //for scheduling and executing tasks
import { User } from '../models/userModel.js'; //importing user model

export const removeUnverifiedAccounts = () => {
    cron.schedule('*/30 * * * *', async () => {
       const thirtyminutesAgo = new Date(Date.now() - 30 * 60 * 1000);
       await User.deleteMany({
           createdAt: { $lte: thirtyminutesAgo },
           accountVerified: false,
       });
    });
}