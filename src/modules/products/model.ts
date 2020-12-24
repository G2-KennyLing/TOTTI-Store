import { ModificationNote } from "../common/model";

export interface IProduct {
	_id?: String,
    name: String,
	description: String,
    unit_price: Number,
	price_sales: Number,
	SKU: String,
	quantity: Number, 
	size: String,
	color: String, 
	product_image: String[],
	category_id: String,
	store_id: String,
	modificationNotes: ModificationNote[]
}