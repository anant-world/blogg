import mongoose from "mongoose";

const connectDB = async () => {{
    try {
        await mongoose.connect('mongodb://localhost:27017/blogapp').then((e)=>console.log("mongodb connected "));
        console.log("MongoDB Connected ");
    } catch (error) {
        console.log("MongoDB connection fault ",error)
    }
}}

export default connectDB;