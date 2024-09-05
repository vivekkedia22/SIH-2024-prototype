import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
       
        console.log(`Mongodb connected :${conn.connection.host}`);
    } catch (error) {
        console.log(`Errorwa:${error.message}`);
        process.exit();
    }
}

export default connectDB;