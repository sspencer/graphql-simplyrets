require('dotenv').config()
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');

const util = require("util")

const typeDefs = require('./types')
const resolvers = require('./resolvers')
const context = require('./auth')


// Work around unhandled promise rejection warning in Apollo 3 by creating async function.
// https://stackoverflow.com/questions/68354656/unhandledpromiserejectionwarning-error-you-must-await-server-start-before
async function startApolloServer(typeDefs, resolvers, port) {
    const server = new ApolloServer({
        context,
        typeDefs,
        resolvers,
        formatError: (err) => {
            console.error(util.inspect(err))
            if (err.message.startsWith('Authentication Error')) {
                return new Error('User not authorized');
            }

            return new Error(err.message)
        },
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({ footer: false })
        ],
    })

    const app = express();
    await server.start();

    server.applyMiddleware({ app, path: '/graphql' });

    app.get('/abc', (req, res, next) => {
        res.send("Good luck! 😀")
    });


    app.listen(port, () => {
        console.log(`Server is listening on port ${port}${server.graphqlPath}`);
    })
}

startApolloServer(typeDefs, resolvers, process.env.SIDE_PORT);