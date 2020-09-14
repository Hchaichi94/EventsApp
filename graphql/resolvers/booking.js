const Booking = require('../../models/booking')
const Event = require('../../models/event')
const { tranforBooking, transformEvent } = require('./merge.js')



module.exports = {

    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('unauthenticated')
        }
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return tranforBooking(booking)
            })
        } catch (error) {
            throw error
        }
    },

    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('unauthenticated')
        }
        const fetchedEvent = await Event.findOne({ _id: args.eventId })
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        })
        const res = await booking.save()
        return tranforBooking(res)
    },

    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('unauthenticated')
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingId })
            return event
        } catch (error) {
            throw error
        }
    }
}



