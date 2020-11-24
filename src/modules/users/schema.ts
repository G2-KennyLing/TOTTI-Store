import * as mongoose from '../../../node_modules/mongoose';
import { ModificationNote } from '../common/model';
import joi = require("joi");

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