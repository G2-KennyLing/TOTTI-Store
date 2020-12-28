import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const articlesSchema = new Schema ({
	name: {
		type: String,
		minlength:[10, "Tiêu đề phải nhiều hơn 10 kí tự"],
		required:[true, 'Một bài viết phải có tiêu đề không được bỏ trống'],
		maxlength:[50, 'Tiêu đề không được quá dài dưới 50 kí tự']
	},
	description: {
		type: String,
		required: [true, "Đây là trường phải có"]
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