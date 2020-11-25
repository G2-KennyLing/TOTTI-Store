import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';
import joi = require("joi");
import { date } from 'joi';

const Schema = mongoose.Schema;

const User = new Schema({
	name: {
		type: {
			firstName: String,
			lastName: String,
		}
	},
	email: String,
	password: String,
	resetPasswordToken:{ 
		type: String,
		default: ""
	},
	  resetPasswordExpires:
	  { type: Date, 
		default: Date.now() },
	phoneNumber: String,
	gender: String,
	isVerified:{
		type: Boolean,
		default: false
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	modificationNotes: [ModificationNote]
});

export default mongoose.model('users', User);