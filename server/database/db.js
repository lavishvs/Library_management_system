import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "Library_Management_System",    
    })
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((error) => {
        console.log("Database Connection Failed", error);
        process.exit(1);
    });
}