import { ModificationNote } from "../common/model";

export interface IOrder {
  _id?: String;
  customer_id: Number;
  status: String;
  order_date: Date;
  discount_code: String;
  store_id: String;
  staff_id: String;
  order_items: [
    {
      product_id: String;
      quantity: Number;
    }
  ];
}
