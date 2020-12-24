import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;
const Stores = new Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    address:{
        type: String
    },
    phoneNumber:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        lowercase:true
    },
    modificationNotes: [ModificationNote]
    
});

export default mongoose.model("store", Stores, "stores")