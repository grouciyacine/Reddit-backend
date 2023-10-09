import mongoose, { model } from "mongoose";
const User=new mongoose.Schema({
    username:{type:String,required:true},
    img:{type:String,required:false},
    email:{type:String,required:true},
    password:{type:String,required:true},
    img:{type:String},
    followers:[String]
})
export default  mongoose.model('User',User)
