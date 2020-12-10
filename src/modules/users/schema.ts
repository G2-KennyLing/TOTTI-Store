import * as mongoose from "mongoose";
import { ModificationNote } from "../common/model";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";
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
  salt: String,
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
<<<<<<< HEAD
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hashed_password = this.encryptPassword(password);
=======
    this.salt = bcrypt.genSaltSync(10);
    this.hashed_password = bcrypt.hashSync(password, this.salt);
>>>>>>> 0330500aa0f83cc7dea523d358e09a729831b5f9
  })
  .get(function () {
    return this.hashed_password;
  });
//@ts-ignore
User.methods = {
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      // return crypto
      //   .createHmac("sha1", this.salt)
      //   .update(password)
      //   .digest("hex");
      return bcrypt.compareSync(password, this.hashed_password)
    } catch (err) {
      return "";
    }
  },
  authenticate: function (plainText) {
    return bcrypt.compareSync(plainText, this.hashed_password);
  },
};

export default mongoose.model("users", User);
