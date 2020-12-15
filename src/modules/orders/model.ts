import { ModificationNote } from "../common/model";

enum productStatus{
	PEDING = 0,
	DELIVERING,
	DELIVERED
}
export interface IOrder {
	_id?: String;
	customer_id: String;
	status?: productStatus;
	order_date: Date;
	discount_code?: String;
	store_id: Number;
	staff_id: Number;
	order_items: [{
		product_id:String,
		quantity: Number
	}]
		
	
}
