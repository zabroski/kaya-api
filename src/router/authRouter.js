const express = require('express');
const authRouter = express.Router();
const { passport, roomPassport, jwtSign} = require('../auth');


authRouter.post('/login', (req, res, next) => {
  passport.authenticate('login', async (error, deliverer, info) => {
    try {
      if (error || !deliverer) {       
        const e = new Error(error)
        return next(e)
      }

      req.login(deliverer, { session: false }, async (error) => {
        if (error) {
          return next(error)
        }

        const { email, id } = deliverer
        const payload = {email, id}
        const token = jwtSign(payload)

        return res.json({ deliverer, token })
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

authRouter.post('/signup', async (req, res, next) => {
  passport.authenticate('signup' , async (err, deliverer, info) => {
    try {
      if (err) {
        console.log(info)
        const error = new Error(err)
        error.status = 400
        return next(error)
      }
      if(!deliverer) {
        let error = new Error(info.message || 'An error occured during sigup')
        error.status = 400
        return next(error)
      }

      const { email, id } = deliverer
      const payload = { email, id}
      const token = jwtSign(payload)
      const message = JSON.stringify(info)
      
      return res.json({deliverer, token, message})

    }catch(e) {
      return next(e)
    }
    
  }) (req, res, next)
})

//<===========merchant app=============>


authRouter.post('/login', (req, res, next) => {
  roomPassport.authenticate('login', async (error, merchant, info) => {
    try {
      if (error || !merchant) {       
        const e = new Error(error)
        return next(e)
      }

      req.login(merchant, { session: false }, async (error) => {
        if (error) {
          return next(error)
        }

        const { email, id } = merchant
        const payload = {email, id}
        const token = jwtSign(payload)

        return res.json({ merchant, token })
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})




authRouter.post('/signup', async (req, res, next) => {
  roomPassport.authenticate('signup' , async (err,  merchant, info) => {
    try {
      if (err) {
        console.log(info)
        const error = new Error(err)
        error.status = 400
        return next(error)
      }
      if(! merchant) {
        let error = new Error(info.message || 'An error occured during sigup')
        error.status = 400
        return next(error)
      }

      const { email, id } =  merchant
      const payload = { email, id}
      const token = jwtSign(payload)
      const message = JSON.stringify(info)
      
      return res.json({ merchant, token, message})

    }catch(e) {
      return next(e)
    }
    
  }) (req, res, next)
})

module.exports = authRouter