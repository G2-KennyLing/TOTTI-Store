import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const Product = new Schema({
	name: {
		type: String,
		required:[true, "product is reauired"],
		trim: true
	},
	description: {
		type: String
	},
    unit_price: {
		type: Number,
		required:[true, "unit price is required"]
	},
	price_sales: {
		type: Number,
		required: [true,'price sales is required']
	},
	SKU: {
		type: String,
		trim: true
	},
	quantity: {
		type: Number,
		required:[true, "quantity is required"]
	},
	size: {
		type: String
	},
	color: {
		type: String
	},
	product_image: { 
		type:[String]},
	category_id: {
		type: Schema.Types.ObjectId,
		ref: 'category'
	},
	store_id: {
		type: Schema.Types.ObjectId,
		ref: 'store'
	},
	//@ts-ignore
	modificationNotes: [ModificationNote]
});

export default mongoose.model('products', Product);