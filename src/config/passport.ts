// const mongoose = require('mongoose');
import {getRepository} from "typeorm";
import { Deliverer } from "../entity/Deliverer";
const passport = require('passport');
const crypto = require('crypto');
const LocalStrategy = require('passport-local');

// const Users = mongoose.model('Users');

const validatePassword = function(password, user) {
    const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {

    getRepository(Deliverer).findOne({email: email}).then((user) => {
      if(!user || validatePassword(password, user)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }
      return done(null, user);
    }).catch(done);
}));