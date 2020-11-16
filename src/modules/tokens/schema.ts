import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const tokenSchema = new mongoose.Schema({
    _userId: String,
    token: String,
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

export default mongoose.model('tokens', tokenSchema);