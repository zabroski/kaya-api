import {createConnection, getRepository, getConnection} from "typeorm";
import { Deliverer } from "../../entity/Deliverer";

const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const jwt = require('jsonwebtoken');


//POST new user route (optional, everyone has access)
// router.post('/', auth.optional, (req, res, next) => {
//     const { body: { deliverer } } = req;
  
//     if(!deliverer.email) {
//       return res.status(422).json({
//         errors: {
//           email: 'is required',
//         },
//       });
//     }
  
//     if(!deliverer.password) {
//       return res.status(422).json({
//         errors: {
//           password: 'is required',
//         },
//       });
//     }
  
//     const finalUser = new Deliverer();
  
//     finalUser.setPassword(deliverer.password);
  
//     return finalUser.save()
//       .then(() => res.json({ deliverer: finalUser.toAuthJSON() }));
//   });
  
const generateJWT = function(deliverer) {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: deliverer.email,
    id: deliverer._id,
    exp: parseInt((expirationDate.getTime() / 1000).toString(), 10),
  }, 'secret');
}

  //POST login route (optional, everyone has access)
  router.post('/login', auth.optional, (req, res, next) => {
    const { body: { deliverer } } = req;
  
    if(!deliverer.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
  
    if(!deliverer.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }
  
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return next(err);
      }
  
      if(passportUser) {
        const deliverer = passportUser;
        deliverer.token = passportUser.generateJWT();
  
        return res.json({ deliverer: {
          id: deliverer.id,
          username: deliverer.email,
          jwt: generateJWT(deliverer)
        } });
      }
  
      // return status(400).info;
    })(req, res, next);
  });


  //GET current route (required, only authenticated users have access)

  // router.get('/current', auth.required, (req, res, next) => {
  //     const { payload: { delivererId } } = req;

  //     return  getRepository(Deliverer).findOne(delivererId).then((deliverer) => {
  //         if(!deliverer) {
  //             return res.sendStatus(400)

  //         }
  //         return res.json({ deliverer: deliverer.toAuthJSON() });
  //     });
  // });


  module.exports = router;