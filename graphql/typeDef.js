import { gql } from "apollo-server";

const typeDefs=gql`
type Post{
    id:ID!,
    title:String!,
    desc:String!,
    img:String!,
    userId:String!,
    likes:[String]!,
    comments:[Comment]!
    createdAt:String!
},
type Comment{
    id:ID!,
    desc:String!,
    username:String!,
    createdAt:String!
}

type DisLike{
    userId:String!
}
type Comment{
    id:ID!,
    body:String!,
    userId:String!,
    createdAt:String!,
    postId:String!
}
type User{
    id:ID!,
    username:String!,
    email:String!,
    token:String!,
    refreshToken:String!,
    img:String!,
    followers:[String]!
}
type SearchUser{
    _id:String!,
    email:String!,
    followers:[String]!
    img:String!,
    username:String!
}
type Followers{
    userId:String!,
    createdAt:String!,
}
input RegisterInput{
    email:String!
    password:String!
    username:String!
}
input CreatePost{
    title:String!,
    desc:String!,
    img:String!,
}
type Query{
getPosts:[Post],
getPost(postId:ID):Post
getComments(postId:ID):[Comment]
getUser(userId:ID):User
SearchUser(name:String):[SearchUser!],
getRandomPosts:[Post]
}
type Refresh{
    newToken:String!,
    newRefreshToken:String!
}
scalar Upload
type File{
    url: String!
}
type Mutation{
    Register(registerInput:RegisterInput):User!,
    RefreshToken(token:String!):Refresh!
    Login(username:String!,password:String!):User!
    CreatePost(createPost:CreatePost):Post!
    CreateComment(body:String!,postId:String):Comment!
    Like(postId:String):String!
    DisLike(postId:String):String!
    Follow(userId:String):String!   
    DisFollow(userId:String):String!
    uploadImage(file:Upload!):File!
    
}
`
export default typeDefs