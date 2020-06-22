import { GraphQLServer } from "graphql-yoga"
import { v4 as uuidv4 } from 'uuid'
import db from './db'

const resolvers = {

  Query: {
    users: (parent, args, {db}, info) => {
        if(!args.quary) 
            return db.users
        
        return db.users.filter(user => user.name.toLowerCase().includes(args.quary.toLowerCase()))
    },

    posts: (parent, args, {db}, info) => {
        if(!args.published) 
            return db.posts
        
        return db.posts.filter(post => post.published && args.published)
    },

    comments: (parent, args, {db}, info) => {
        return db.comments
    }
  },

  Mutation: {
    createUser: (parent, args, {db}, info) => {
        let emailTaken = db.users.some((user) =>user.email === args.data.email)

        if(emailTaken) {
            throw new Error("Email Taken")
        }

        const User = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(User)

        return User
    },

    deleteUser: (parent, args, {db}, info) => {
        const userIndex = db.users.findIndex(user => user.id === args.id)

        if(userIndex === -1) {
            throw new Error("User Not Found")
        }
        const deletedUsers = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter(post => {
            const match = post.id === args.id
            if(match) {
                db.comments = db.comments.filter(comment => comment.post !== post.id)
            }
            return !match
        })

        db.comments = db.comments.filter(comment => comment.user !== args.id)

        return deletedUsers[0]
    },
    
    createPost: (parent, args, {db}, info) => {
        let userExists = db.users.some(user => user.id === args.data.author)

        if(!userExists) {
            throw new Error('User Cannot Find')
        }

        const Post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(Post)
        
        return Post
    }, 

    deletePost: (parent, args, {db}, info) => {
        let postIndex = db.posts.findIndex(post => post.id === args.id)

        if(postIndex === -1) {
            throw new Error("Post Not Found")
        }
        const deletedPosts = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter(comment => comment.post !== args.id)

        return deletedPosts[0]

    },

    createComment: (parent, args, {db}, info) => {
        let userExists = db.users.some(user => user.id === args.data.owner)

        let postExists = db.posts.some(post => args.data.post === post.id && post.published)

        if(!userExists || !postExists) {
            throw new Error('Unable to find post and user')
        }

        const Comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(Comment)
        return Comment       
    },

    deleteComment: (parent, {db}, ctx, info) => {
        let commentIndex = db.comments.findIndex(comment => comment.id === args.id)
        if(commentIndex === -1) {
            throw new Error("Comment Not Found")
        }
        const deletedComments = db.comments.splice(commentIndex, 1)
        return deletedComments[0]
    }
  },

  Post: {
    author:  (parent, args, {db}, info) => {
        return db.users.find (user => user.id === parent.author)
    }, 

    comments: (parent, args, {db}, info) => {
        return db.comments.filter(comment => comment.post === parent.id)
    },
    
  },
  
  User: {
      posts: (parent, args, {db}, info) => {
        return db.posts.filter(post => post.author === parent.id)
      },

      comments: (parent, {db}, ctx, info) => {
        return db.comments.filter(comment => comment.owner === parent.id)
    },
  }, 
  
  Comment: {
    owner: (parent, args, {db}, info) => {
        return db.users.find( user => user.id === parent.owner)
    },
    post: (parent, args, {db}, info) => {
        return db.posts.find( post => post.id === parent.post)
    } 
  } 
};

const server = new GraphQLServer ({ 
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
});
server.start(() => console.log("Server is running on localhost:4000"));
