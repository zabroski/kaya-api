import { Deliverer } from "../entity/Deliverer";
import {createConnection, getRepository} from "typeorm";

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
      await connection.close();

      if (!deliverer) {
        return done({ message: 'Deliverer not found'})
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




//<=============Merchant auth==================>


// roomPassport.use(new JWTStrategy({
//   secretOrKey: SECRET,
//   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
// }, async(token, done) => {
 
// }))




// roomPassport.use('login', new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
// }, async (email, password, done) => {

//   createConnection().then(async (connection) => {
    
//     try {
//       let merchant:any;

//       //database call to find user (deliverer) by email
//       merchant = await getRepository(Merchant).findOne({email: email});
//       await connection.close();

//       if (!merchant) {
//         return done({ message: 'Merchant not found'})
//       }

//           // compare passwords
//       const isMatching = await bcrypt.compare(password, merchant.password);
//       // const isMatching = password === deliverer.password;
//       console.log(`*** validate: ${isMatching} ***`)
//       console.log(password, merchant.password)

//       if (!isMatching) {
//         return done({ message: 'Wrong password'})
//       }else{
//         // login was a success, return the user object
//         return done(null, merchant, { message: 'Logged in successfully'})
//       }
//     } catch(error) {
//       return done(error)
//     }
//   });
// }))




// roomPassport.use('signup', new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   passReqToCallback: true
// }, async (req, email, password, done) => {

//   try {
//       console.log(req)
//       const { body } = req
      
//     createConnection().then(async (connection) => {
//       const merchant = new Merchant();
//       merchant.email = email;
//       merchant.firstName = body.firstName;
//       merchant.lastName = body.lastName;

//       const hashedPassword = await bcrypt.hash(
//           password,
//           Number(process.env.SALT_ROUNDS)
//       )

//       merchant.password = hashedPassword;
            
//       await connection.manager.save(merchant);
//       await connection.close();

//       if(!merchant) {
//           return done(null, false, {message: 'User not a user'})
//       }

//       done(null, merchant, {message: 'User suucessfuly created'})
//     });
//   } catch(e) {
//       done(e)
//   }
// }))










// const authorized = (request, response, next) => {
//     passport.authenticate('jwt', { session: false }, async (error, user) => {
//       if (error || !user) {
//         let err:any = new Error('No sccess allowed')
//         err.status = 401
//         return next(err)
//       }

//       request.user = user
//       return next()
//     })(request, response, next)
//   }

export {passport, jwtSign,}
