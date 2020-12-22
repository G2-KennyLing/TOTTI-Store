import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const articlesSchema = new Schema ({
	heading: String,
	content: String,
	image: String,
	author: String,
	status: {
		type: Number,
		enum: [0, 1, 2],
		default: 0
	}
})

export default mongoose.model('articles', articlesSchema);