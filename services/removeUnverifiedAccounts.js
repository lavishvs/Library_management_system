import cron from 'node-cron'; //for scheduling and executing tasks
import { User } from '../models/userModel.js'; //importing user model

export const removeUnverifiedAccounts = () => {
       cron.schedule('0 0 * * * *', async () => {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const result = await User.deleteMany({
            createdAt: { $lte: thirtyMinutesAgo },
            accountVerified: false,
        });
        console.log(`Removed ${result.deletedCount} unverified accounts at ${new Date().toLocaleTimeString()}`);
    });
}