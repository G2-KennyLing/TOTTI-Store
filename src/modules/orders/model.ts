import { ModificationNote } from "../common/model";

enum productStatus {
	PEDING = 0,
	DELIVERING,
	DELIVERED
}
export interface IOrder {
  _id?: String;
  customer_id?: String;
  status: productStatus;
  order_date: Date;
  name: {
    firstName: String;
    lastName: String;
  };
  payment?: Object;
  address: String;
  phone_number: String;
  payment_method: Number;
  discount_code?: String;
  order_items: [
    {
      product_id: String;
      quantity: Number;
    }
  ];
}
