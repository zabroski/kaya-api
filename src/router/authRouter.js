const express = require('express')
const authRouter = express.Router()
const { passport , jwtSign} = require('../auth/auth.js') //import enhanced passport instance


// matches '/auth/login' route
authRouter.post('/login', (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
       
        const error = new Error(error)
        return next(error)
      }

      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error)
        }

        const { email, id } = user
        const payload = {email, id}
        const token = jwtSign(payload)

        return res.json({ user, token })
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

authRouter.post('/signup', async (req, res, next) => {
  passport.authenticate('signup' , async (err, user, info) => {
    try {
      if (err) {
        console.log(info)
        const error = new Error(err)
        error.status = 400
        return next(error)
      }
      if(!user) {
        let error = new Error(info.message || 'An error occured during sigup')
        error.status = 400
        return next(error)
      }

      const { email, id } = user
      const payload = { email, id}
      const token = jwtSign(payload)
      const message = JSON.stringify(info)

      return res.json({user, token, message})

    }catch(e) {
      return next(e)
    }
  }) (req, res, next)
})

module.exports = authRouter
