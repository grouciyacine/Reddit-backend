import userResolver from './user.js'
import PostResolver from './post.js'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
export default {
    Upload:GraphQLUpload,
    Query:{
        ...PostResolver.Query,
        ...userResolver.Query
    },
    Mutation:{
        ...userResolver.Mutation,
        ...PostResolver.Mutation
        
    }
}