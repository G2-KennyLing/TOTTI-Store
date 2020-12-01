import { ModificationNote } from "../common/model";

export interface order {
	_id?: String;
	customer_id: Number;
	status: String;
	order_date: Date;
	discount_code: String;
	store_id: Number;
	staff_id: Number;
	order_items: [{
		product_id: Number;
	}]
}