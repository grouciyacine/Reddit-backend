import jwt from 'jsonwebtoken'
import {AuthenticationError} from 'apollo-server'
const verify=(context)=>{
    const  authHeader = context.req.headers.authorization
    if(authHeader){
        const token=authHeader.split('Bearer ')[1]
        if(token){
            try{
                const user=jwt.verify(token,process.env.JWT)
                return user
            }catch(e){
                throw new AuthenticationError(e)
            }
        }else{
             throw new AuthenticationError('Error no Token Exist')
        }
    }else{
        throw new AuthenticationError('Error no authHeader present')
    }
}
export default verify