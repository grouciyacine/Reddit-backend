import User from '../../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserInputError } from 'apollo-server'
import Post from '../../models/Post.js'
import verify from '../../verify.js'
import Comment from '../../models/Comment.js'
let refreshTokens = []
const creatToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT)
}
const RefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.RJWT, { expiresIn: '1y' })
}
export default {
    Query: {
        async getComments(_, { postId }, context, info) {
            const All_Comments = await Comment.find({ postId: postId }).sort({ createdAt: -1 })
            return All_Comments
        },
        async getUser(_, { userId }, context, info) {
            const user = await User.findById(userId)
            return user
        },
        async SearchUser(_, { name }, context, info) {
            const user = await User.find({ username: { $regex: name } })
            if (!user) throw new UserInputError("No user exist"), {
                errors: {
                    name: "No user exist"
                }
            }
            return user
        }
    },
    Mutation: {
        async Register(_, { registerInput: { username, password, email,img } }, context, info) {
            const user = await User.find({ username: username })
            if (user.length > 0) {
                throw new UserInputError('username already exists'), {
                    errors: {
                        username: 'this username is already registered'
                    }
                }
            }
            const Salt = 12
            const newPassword = bcrypt.hashSync(password, Salt)
            const newUser = new User({
                username: username,
                password: newPassword,
                email: email,
                img:img
            })
            const res = await newUser.save()
            const token = jwt.sign({ id: res._id }, process.env.JWT)
            return {
                img:res.img,
                username: res.username,
                email: res.email,
                id: res._id,
                token
            }
        },
        async RefreshToken(_, { token }, context, info) {
            const refreshToken = token;
            if (!refreshToken) throw new UserInputError('Invalid Token')
            if (!refreshTokens.includes(refreshToken)) throw new UserInputError('Refresh Token is not in the refresh')
            const user = await new Promise((resolve, reject) => {
                jwt.verify(refreshToken, process.env.RJWT, (err, decoded) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newToken = creatToken(user);
            const newRefreshToken = RefreshToken(user);
            refreshTokens.push(newRefreshToken);
            return {
                newToken,
                newRefreshToken
            };
        },
        async Login(_, { username, password }, context, info) {
            const user = await User.findOne({ username: username })

            if (!username || !password) {
                throw new UserInputError('Username and Password must be', {
                    errors: {
                        username: 'username and password should not be empty',
                    }
                })
            }
            if (!user) {
                throw new UserInputError('Username not exist', {
                    errors: {
                        username: 'user not exist',
                    }
                })
            }
            const checkPassword = await bcrypt.compareSync(password, user.password)
            if (!checkPassword) {
                throw new UserInputError('Password not match', {
                    errors: {
                        password: 'wrong password',
                    }
                })
            }
            const token = creatToken(user)
            const refreshToken = RefreshToken(user)
            refreshTokens.push(refreshToken)
            return {
                id: user._id,
                email: user.email,
                username: user.username,
                img: user.img,
                token,
                refreshToken
            }

        },
        async CreatePost(_, { createPost: { title, desc, img } }, context, info) {
            const user = verify(context)
            const post = new Post({ title: title, desc: desc, img: img, userId: user.id })
            await post.save()
            return post
        },
        async CreateComment(_, { postId, body }, context, info) {
            const user = verify(context)
            const newComment = new Comment({ body: body, userId: user.id, postId: postId })
            await newComment.save()
            return newComment
        },
        async Like(_, { postId }, context, info) {
            const user = verify(context)
            await Post.findByIdAndUpdate(postId, { $addToSet: { likes: [user.id] } })
            return "Like "
        },
        async DisLike(_, { postId }, context, info) {
            const user = verify(context)
            await Post.findByIdAndUpdate(postId, { $pull: { likes: user.id } })
            return "Dislike Post with Success"
        },
        async Follow(_, { userId }, context, info) {
            const user = verify(context);
            console.log(user.id)
            await User.findByIdAndUpdate(userId, { $addToSet: { followers: [user.id] } })
            return "now you are following this user"
        },
        async DisFollow(_, { userId }, context, info) {
            const user = verify(context)
            await User.findByIdAndUpdate(userId, { $pull: { followers: user.id } })
            return "you are now not following this user"
        },

    }
}
