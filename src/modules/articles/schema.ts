import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const articlesSchema = new Schema ({
	name: {
		type: String,
	},
	description: {
		type: String,
	},
	summary: String,
	body: String,
	image: String,
	user_id: {
		type: Schema.Types.ObjectId,
		ref:"users"
	},
	status: {
		type: Number,
		enum: [0, 1, 2],
		default: 0
	}
})

export default mongoose.model('articles', articlesSchema);