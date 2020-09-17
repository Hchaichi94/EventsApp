const express = require('express')
const boyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose')
const app = express()

const grapgQlSchema = require('./graphql/schema/index')
const grapghQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.use(isAuth)
app.use(boyParser.json())
app.use('/graphql', graphqlHTTP({

    schema: grapgQlSchema,

    rootValue: grapghQlResolvers,

    graphiql: true
}))

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ac7gz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        app.listen(3000)
    })
    .catch(err => {
        console.log(err)
    })



