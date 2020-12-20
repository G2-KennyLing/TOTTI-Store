import { ModificationNote } from "../common/model";

enum productStatus{
	PEDING = 0,
	DELIVERING,
	DELIVERED
}
export interface IOrder {
  _id?: String;
  customer_id?: Number;
  status: Number;
  order_date: Date;
  shipping_address: String;
  billing_address: String;
  payment_method: Number;
  discount_code?: String;
  store_id: String;
  phone_number: String;
  staff_id: String;
  order_items: [
    {
      product_id: String;
      quantity: Number;
    }
  ];
}
