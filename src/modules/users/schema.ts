import * as mongoose from "mongoose";
import { ModificationNote } from "../common/model";
import * as uuid from ""
const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type: {
      firstName: String,
      lastName: String,
    },
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true
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
    enum: [0,1],
    default: 0
  },
  history: {
    type: Array,
    default: []
  },
  modificationNotes: [ModificationNote],
});


User.virtual("password")
.set(function(password){
  this._password = password;
  this.salt = uuid();
  this.hashed_password = this.encryptPassword(password);
})
.get(function(){
  return this.hashed_password;
})

User.methods = {
  encryptPassword: function(password){
    if(!password) return "";
    try{
      return crypto.createHmac("sha1",this.salt)
                    .update(password)
                    .digest('hex');
    }catch(err){
      return ""
    }
  },
  authenticate: function(plainText){
      return this.encryptPassword(plainText) === this.hashed_password;
  }
}

export default mongoose.model("users", User);
