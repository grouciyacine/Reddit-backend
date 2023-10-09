import mongoose from "mongoose";

const Comment=new mongoose.Schema({
    body:{type:String, required:true},
    postId:{type:String, required:true},
    userId:{type:String, required:true},
},{timestamps:true});
export default mongoose.model('Comment',Comment);