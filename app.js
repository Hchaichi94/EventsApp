const express = require('express')
const boyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql') //takes string to define schema
const mongoose = require('mongoose')
const events = []
const app = express()
const Event = require('./models/event')

app.use(boyParser.json())
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
    type Event {
        _id:ID!
        title:String!
        description:String!
        price:Float!
        date:String!
    }

    input EventInput{
        title:String!
        description:String!
        price:Float!
        date:String!
    }

    type RootQuery{
        events :[Event!]!
    }

    type RootMutation {
        createEvent(eventInput:EventInput):Event
    }

    schema {
        query:RootQuery
        mutation:RootMutation
    }
    `), //valide garphql schema 
    //[String!]! => not list of null
    rootValue: {
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc, _id: event.id }
                    })
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            return event
                .save()
                .then(res => {
                    console.log(res)
                    return { ...res._doc, _id: res._doc._id.toString() }
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
        }
    }, //endpoints : resolvers
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



