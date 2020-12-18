import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const Product = new Schema({
	name: String,
	description: String,
    unit_price: Number,
	price_sales: Number,
	discount: Number,
	SKU: String,
	quantity: Number,
	size: String,
	color: String,
	product_image: { 
		type:{
			link: String
	}},
	category_id: Number,
	provider_id: Number,
	store_id: Number,
	//@ts-ignore
	modificationNotes: [ModificationNote]
});

export default mongoose.model('products', Product);

module.exports ={
    Product
}