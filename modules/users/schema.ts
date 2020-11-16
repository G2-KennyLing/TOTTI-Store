import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: {
            firstName: String,
            lastName: String
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

export default mongoose.model('users', schema);