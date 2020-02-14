const express = require  ('express')
console.log(express)
const appRouter = express.Router()
const { passport } = require('../auth/auth')

appRouter.get('/profile', passport.authenticate('jwt', { session: false}),
async(req, res) => {
    console.log(req.user)
    res.json({ user: req.user, message: 'authenticated'})
}
)

module.exports = appRouter