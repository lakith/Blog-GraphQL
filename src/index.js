import { GraphQLServer } from "graphql-yoga";

const users = [
    {
        id: '1',
        name: 'Lakith Muthugala',
        email: 'lakith1995@gmail.com',
        age: 23
    },
    {
        id: '2',
        name: 'Hansi Yapa',
        email: 'hansi@gmail.com',
        age: 23
    },
    {
        id: '3',
        name: 'Sudeep',
        email: 'sudeep@gmail.com',
        age: 50
    }
]

const posts = [
    {
        id: '1',
        title: 'graphQL',
        body: 'This is a graphQL post',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'socketIO',
        body: 'This is a socketIO post',
        published: true,
        author: '1'
    },
    {
        id: '3',
        title: 'nginX',
        body: 'This is a nginX post',
        published: false,
        author: '2'
    },
]

const comments = [
    {
        id: '1',
        text: 'This is a awsome post.',
        owner: '2',
        post: '1'
    },
    {
        id: '2',
        text: 'Super Post.',
        owner: '1',
        post: '3'
    },
    {
        id: '3',
        text: 'Thanks for sharing this.',
        owner: '3',
        post: '1'
    },
    {
        id: '4',
        text: 'Clear steps, easy to fallow',
        owner: '3',
        post: '2'
    }
]

const typeDefs = `
    type Query {
        me: User!
        add(a: Float!, b: Float!): Float!
        users(quary: String): [User]!
        posts(published: Boolean): [Post]!
        comments: [Comment]
    }

    type User {
        id : ID!
        name: String!
        email: String!
        age: Int!
        posts: [Post],
        comments: [Comment]
    }

    type Comment {
        id: ID!
        text: String!
        owner: User
        post: Post 
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!,
        author: User!
        comments: [Comment]
    }
`;

const resolvers = {

  Query: {
    me: () => {
        return {
            id: '123abc',
            name: 'Lakith Muthugala',
            email: 'lakith1995@gmail.com',
            age: 23 
        }
    },

    users: (parent, args, ctx, info) => {
        if(!args.quary) 
            return users
        
        return users.filter(user => user.name.toLowerCase().includes(args.quary.toLowerCase()))
    },

    posts: (parent, args, ctx, info) => {
        if(!args.published) 
            return posts
        
        return posts.filter(post => post.published && args.published)
    },

    comments: (parent, args, ctx, info) => {
        return comments
    },

    add: (parent, args, ctx, info) => {
        if (args.a && args.b) {
            return args.a + args.b
        } else {
            return 0
        }
    }
  },

  Post: {
    author:  (parent, args, ctx, info) => {
        return users.find (user => user.id === parent.author)
    }, 

    comments: (parent, args, ctx, info) => {
        return comments.filter(comment => comment.post === parent.id)
    },
    
  },
  
  User: {
      posts: (parent, args, ctx, info) => {
        return posts.filter(post => post.author === parent.id)
      },

      comments: (parent, args, ctx, info) => {
        return comments.filter(comment => comment.owner === parent.id)
    },
  }, 
  
  Comment: {
    owner: (parent, args, ctx, info) => {
        return users.find( user => user.id === parent.owner)
    },
    post: (parent, args, ctx, info) => {
        return posts.find( post => post.id === parent.post)
    } 
  } 
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
