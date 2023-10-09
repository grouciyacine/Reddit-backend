import mongoose from "mongoose";
mongoose.set('strictQuery', true)
export const connect=async(URL)=>{
    await mongoose.connect(URL)
}
