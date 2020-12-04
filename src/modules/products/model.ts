import { ModificationNote } from "../common/model";

export interface IProduct {
	_id?: String,
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
	modificationNotes: ModificationNote[]
}