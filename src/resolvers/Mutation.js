import { v4 as uuidv4 } from 'uuid'

const Mutation = {

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

    updateUser: (parent, args, {db}, info) => {
        let user = db.users.find(user => user.id === args.id)

        if(!user) {
            throw new Error("User Not Found")
        }

        if(typeof args.data.email === "string") {
            const emailTaken = db.users.some((user) =>user.email === args.data.email)
            if(emailTaken) {
                throw new Error("Email Taken")
            }
            user.email = args.data.email
        }
        if(typeof args.data.name === "string") {
            user.name = args.data.name
        }
        if(typeof args.data.age !== 'undefined') {
            user.age = args.data.age
        }

        return user
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
    
    createPost: (parent, args, {db, pubsub}, info) => {
        let userExists = db.users.some(user => user.id === args.data.author)

        if(!userExists) {
            throw new Error('User Cannot Find')
        }

        const Post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(Post)

        if(args.data.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: Post
                }})
        }
        
        return Post
    },

    updatePost: (parent, args, {db, pubsub}, info) => {
        let post = db.posts.find(post => post.id === args.id)
        let originalPost = {...post}

        if(!post) {
            throw new Error("Post Not Found")
        }

        if(typeof args.data.title === "string") {
            post.title = args.data.title
        }
        if(typeof args.data.body === "string") {
            post.body = args.data.body
        }
        if(typeof args.data.published === "boolean") {
            post.published = args.data.published

            if(args.data.published && !originalPost.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: Post
                    }
                })
            } else if (!args.data.published && originalPost.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: Post
                    }
                })
            }
        } else if(post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: Post
                }
            })
        }

        return post
    },

    deletePost: (parent, args, {db, pubsub}, info) => {
        let postIndex = db.posts.findIndex(post => post.id === args.id)

        if(postIndex === -1) {
            throw new Error("Post Not Found")
        }
        const deletedPosts = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter(comment => comment.post !== args.id)

        pubsub.publish('post', {
            post: {
                mutation: 'DELETED',
                data: deletedPosts[0]
            }
        })

        return deletedPosts[0]

    },

    createComment: (parent, args, {db, pubsub}, info) => {
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
        pubsub.publish(`comment ${args.data.post}`, {comment: {
            mutation: "CREATED",
            data: Comment
        }})

        return Comment       
    },

    updateComment: (parent, args, {db, pubsub}, info) => {
        let comment = db.comments.find(comment => comment.id === args.id)
        if(!comment) {
            throw new Error("Comment Not Found")
        }
        comment.text = args.data.text

        pubsub.publish(`comment ${comment.post}`, {comment: {
            mutation: "UPDATED",
            data: comment
        }})

        return comment
    },

    deleteComment: (parent, args, {db, pubsub}, info) => {
        let commentIndex = db.comments.findIndex(comment => comment.id === args.id)
        if(commentIndex === -1) {
            throw new Error("Comment Not Found")
        }
        const deletedComments = db.comments.splice(commentIndex, 1)

        pubsub.publish(`comment ${deletedComments[0].post}`, {comment: {
            mutation: "DELETED",
            data: deletedComments[0]
        }})

        return deletedComments[0]
    }

}

export default Mutation