import { Deliverer } from "../entity/Deliverer";
import {createConnection, getRepository, Connection } from "typeorm";

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const SECRET = 'suoer long string'

const jwtSign = (payload) =>{
    return jwt.sign(payload, SECRET)
}

passport.use(new JWTStrategy({
    secretOrKey: SECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async(token, done) => {
    // try {
        // const user = await User.findByPk(token.id)

        // if(user) {
        //     done(null, user)
        // }
        // else {
        //     done(null. false)
        // }

    // } 
    // catch(e) {
    //     done(e)
    // }
}))

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  

  createConnection().then(async (connection) => {
    
    try {
      let deliverer:any;

      //database call to find user (deliverer) by email
       deliverer = await getRepository(Deliverer).findOne({email: email});

      if (!deliverer) {
        return done({ message: 'User not found'})
      }

          // compare passwords
      const isMatching = await bcrypt.compare(password, deliverer.password);
      // const isMatching = password === deliverer.password;
      console.log(`*** validate: ${isMatching} ***`)
      console.log(password, deliverer.password)

      if (!isMatching) {
        return done({ message: 'Wrong password'})
      }else{
        // login was a success, return the user object
        return done(null, deliverer, { message: 'Logged in successfully'})
      }
    } catch(error) {
      return done(error)
    }
  });
}))


passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
  
    try {
        console.log(req)
        const { body } = req

        // const user = await User.create({
        //     name: name,
        //     email: email,
        //     password: password
        // })

      createConnection().then(async (connection) => {
        const deliverer = new Deliverer();
        deliverer.email = email;
        deliverer.firstName = body.firstName;
        deliverer.lastName = body.lastName;

        const hashedPassword = await bcrypt.hash(
            password,
            Number(process.env.SALT_ROUNDS)
        )

        deliverer.password = hashedPassword;
              
        await connection.manager.save(deliverer);
        await connection.close();

        if(!deliverer) {
            return done(null, false, {message: 'User not a user'})
        }

        done(null, deliverer, {message: 'User suucessfuly created'})
      });
    } catch(e) {
        done(e)
    }
}))

const authorized = (request, response, next) => {
    passport.authenticate('jwt', { session: false }, async (error, user) => {
      if (error || !user) {
        // response.status(401).json({ message: 'Unauthorized' });
        let err:any = new Error('No sccess allowed')
        err.status = 401
        return next(err)
      }

      request.user = user
      return next()
    })(request, response, next)
  }

export {passport, jwtSign, authorized}
//  passport;
// module.exports = {
//   passport, jwtSign, authorized 
// }