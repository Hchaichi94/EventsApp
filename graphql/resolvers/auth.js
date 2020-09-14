const bcrypt = require('bcryptjs')
const User = require('../../models/user');
const jwt = require('jsonwebtoken')

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
    },

    login: async ({ email, password }) => {

        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error('user does not exist')
        }

        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            throw new Error('password is incorrect')
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey',
            {
                expiresIn: '1h'
            })

        return ({ userId: user.id, token: token, tokenExpiration: 1 })
    }
}