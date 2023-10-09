import {UserInputError} from 'apollo-server'
import Post from '../../models/Post.js'
import verify from '../../verify.js'
import cloudinary from 'cloudinary'
import User from '../../models/User.js'

export default {
    Query:{
        async getPosts(_,{},context){
            const userId=verify(context)
            const myData=await User.findById(userId.id)
            console.log(myData.followers)
            const followersIds=myData.followers.map((id)=>id)
            followersIds.push(userId.id);
            const posts=await Post.find({userId:{$in:followersIds}}).sort({createdAt:-1})
            return  posts
        },
        async getRandomPosts(_,{}){
            const posts=await Post.aggregate([{$sample:{size:40}}])
            return posts
        },
        async getPost(_,{postId}){
            const post=await Post.findById(postId)
            return post
        }
    },
    Mutation:{
        async uploadImage(_,{file}){
            const {createReadStream,filename}=await file
            const stream=createReadStream();
            const cloudinaryUpload=await cloudinary.v2.uploader.upload(stream,{
                folder:'uploads',
                public_id:filename
            })
            return {url:cloudinaryUpload.secure_url}
        },
    }
}