import mongoose from "mongoose";

const Post=new mongoose.Schema({
    title:{required:true,type:String},
    img:{type:String},
    desc:{type:String,required:true},
    userId:{type:String,required:true},
    likes:[String],
},{timestamps:true})
export default mongoose.model('Post',Post)