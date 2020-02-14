const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User } = require('../models/index.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const SECRET = 'suoer long string'

const jwtSign = (payload) =>{
    return jwt.sign(payload, process.env.SECRET)
}

passport.use(new JWTStrategy({
    secretOrKey: process.env.SECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async(token, done) => {
    try {
        const user = await User.findByPk(token.id)

        if(user) {
            done(null, user)
        }
        else {
            done(null. false)
        }

    } catch(e) {
        done(error)
    }
}))

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // find user by their email
    const user = await User.findOne({ where: { email: email }})
    console.log(user)
    console.log(`*** user: ${user} ***`)

    if (!user) {
      return done(null, false, { message: 'User not found'})
    }

    // compare passwords
    const validate = await bcrypt.compare(password, user.password);
    console.log(`*** validate: ${validate} ***`)
    console.log(password, user.password)

    if (!validate) {
      return done(null, false, { message: 'Wrong password'})
    }

    // login was a success, return the user object
    return done(null, user, { message: 'Logged in successfully'})

  } catch(error) {
    return done(error)
  }
}))

passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        console.log(req)
        const { body: { name } } = req

        const user = await User.create({
            name: name,
            email: email,
            password: password
        })

        if(!user) {
            return done(null, false, {message: 'User not a user'})
        }
        done(null, user, {message: 'User suucessfuly created'})

    } catch(e) {
        done(e)

    }
}))

const authorized = (request, response, next) => {
    passport.authenticate('jwt', { session: false }, async (error, user) => {
      if (error || !user) {
        // response.status(401).json({ message: 'Unauthorized' });
        let err = new Error('No sccess allowed')
        err.status = 401
        return next(err)
      }

      request.user = user
      return next()
    })(request, response, next)
  }

module.exports = {
  passport, jwtSign, authorized
}