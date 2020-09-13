const bcrypt = require('bcryptjs')
const User = require('../../models/user');

module.exports = {

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
            return {
                ...res._doc,
                password: null,
                _id: res._doc._id.toString()
            }

        } catch (error) {
            throw error
        }
    }
}