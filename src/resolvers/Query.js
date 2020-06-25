const Query = {
   
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

  }

  export default Query