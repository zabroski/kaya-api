const express = require  ('express')
console.log(express)
const appRouter = express.Router()
const { passport } = require('../auth/auth')

appRouter.get('/profile', passport.authenticate('jwt', { session: false}),
async(req, res) => {
    console.log(req.deliverer)
    res.json({ deliverer: req.deliverer, message: 'authenticated'})
}
)

module.exports = appRouter