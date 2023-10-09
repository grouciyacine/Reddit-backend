import {ApolloServer} from 'apollo-server'
import dotenv from 'dotenv'
import { connect } from './connect.js'
import typeDefs from './graphql/typeDef.js'
import resolvers from './graphql/res/index.js' 
import cors from 'cors'
import express from 'express'
import cloudinary from 'cloudinary'

dotenv.config()
const app = express();
cloudinary.v2.config({
    cloud_name:'dlagodwt2',
    api_key:"452952129178187",
    api_secret:'DJhFrdw5tvA07hCB47zjf-7sxbc'
})
app.use(cors());
const server=new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>({req})
})
const start=async()=>{
    try{
        await connect(process.env.URL)
        return server.listen({port:5000}).then((res)=>{console.log(`port listen in ${res.url}`)})
    }catch(err){
        console.log(err)
    }
}
start()