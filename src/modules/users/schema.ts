import { NextFunction } from 'express';
import * as mongoose from "mongoose";
import { ModificationNote } from "../common/model";
import * as crypto from "crypto";
import bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type: {
      firstName: String,
      lastName: String,
    },
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  phoneNumber: String,
  gender: Boolean,
  isVerified: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  role: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  cart: {
    type: Array,
    default: [
      {
        product_id: String,
        quantity: Number,
      },
    ],
  },
  //@ts-ignore
  modificationNotes: [ModificationNote],
});

User.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = 10;
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this.hashed_password;
  });
//@ts-ignore
User.methods = {
  encryptPassword: function (password,next: NextFunction) {
    if (!password) return "";
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if(err) {
        return next(err);   
      }

      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next()
      });
    })  
  }
  else {
    next()
  }
  },
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
};

export default mongoose.model("users", User);
