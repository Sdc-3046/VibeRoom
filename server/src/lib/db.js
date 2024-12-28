import mongoose from 'mongoose';
import {config} from "dotenv";

config({path: "../.env"});

export const connectDB = async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB", connection.connection.host);
    }
    catch(err){
        console.log("Error connecting to MongoDB", err);
    }
};