import { date } from 'joi';
import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const Orders = new Schema({
	customer_id : Number,
	status: String,
	order_date: Date,
	ship_date: Date,
	discount_code: String,
	store_id: Number,
	staff_id: Number,
	order_items: {
		type: {
			product_id: String,
			ref: "products"
		}
	},
	modificationNote: [ModificationNote]
});

export default mongoose.model('orders', Orders)