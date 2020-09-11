const Event = require('../../models/event')
const User = require('../../models/user');
const bcrypt = require('bcryptjs')


const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (error) {
        throw error
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
        return events
    } catch (error) {
        throw error
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                }
            })
        }
        catch (error) {
            throw error
        }
    },

    createEvent: async (args) => {

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5f5b3d2001af3e1ce4ace05d'
        })
        let createdEvent
        try {
            const res = await event.save()
            createdEvent = {
                ...res._doc,
                _id: res._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, res._doc.creator)
            }
            const creator = await User.findById('5f5b3d2001af3e1ce4ace05d')
            if (!creator) {
                throw new Error('user not found')
            }
            creator.createdEvents.push(event)
            await creator.save()
            return createdEvent
        } catch (error) {
            throw error
        }
    },

    createUser: async args => {
        try {
            const user = await User.findOne({ email: args.userInput.email })
            if (user) {
                throw new Error('user already exist')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const userCreated = new User({
                email: args.userInput.email,
                password: hashedPassword,
            })

            const res = await userCreated.save()
            return { ...res._doc, password: null, _id: res._doc._id.toString() }

        } catch (error) {
            throw error
        }
    }
}