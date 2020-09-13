const Event = require('../../models/event')
const User = require('../../models/user');
const { transformEvent } = require('./merge.js')

module.exports = {

    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transformEvent(event)
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
            date: dateToString(args.eventInput.date),
            creator: '5f5e6e09527e7139201e5c70'
        })
        let createdEvent
        try {
            const res = await event.save()
            createdEvent = transformEvent(res)
            const creator = await User.findById('5f5e6e09527e7139201e5c70')

            if (!creator) {
                throw new Error('user not found')
            }
            creator.createdEvents.push(event)
            await creator.save()
            return createdEvent
        } catch (error) {
            throw error
        }
    }
}