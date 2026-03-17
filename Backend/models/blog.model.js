import mongoose, { Schema } from "mongoose";

const blogSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    subTitle:{
        type:String,
    },
    description:{
        type:String
    },
    thumbnail:{
        type:String

    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    category:{
        type:String,

    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId, ref:"User"
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId, ref:"Comment"
    }],
    isPublished:{
        type:Boolean,
        default:true
    }
    
},{timestamps:true})

export const Blog=mongoose.model("Blog",blogSchema);