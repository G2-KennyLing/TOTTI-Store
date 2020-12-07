import { ModificationNote } from "../common/model";

export interface IOrder {
	_id?: String;
	customer_id: Number;
	status: String;
	order_date: Date;
	discount_code: String;
	store_id: Number;
	staff_id: Number;
	order_items: {
		type: {
			product_id: String;
			ref: "products"
		}
	}
}