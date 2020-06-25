import { GraphQLServer, PubSub } from "graphql-yoga"
import db from './db'
import Query from './resolvers/Query'
import Subscription from './resolvers/Subscription'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'

const pubsub = new PubSub()

const server = new GraphQLServer ({ 
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Post,
        User,
        Comment
    },
    context: {
        db,
        pubsub
    }
});
server.start(() => console.log("Server is running on localhost:4000"));
