const Booking = require('../../models/booking')
const Event = require('../../models/event')
const { tranforBooking, transformEvent } = require('./merge.js')



module.exports = {

    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return tranforBooking(booking)
            })
        } catch (error) {
            throw error
        }
    },

    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId })
        const booking = new Booking({
            user: '5f5e6e09527e7139201e5c70',
            event: fetchedEvent
        })
        const res = await booking.save()
        return tranforBooking(res)
    },

    cancelBooking: async args => {
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



