import { date } from "joi";
import * as mongoose from "mongoose";
import { ModificationNote } from "../common/model";

const Schema = mongoose.Schema;
interface order_item {
  product_id: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "products";
  };
  quantity: Number;
}
const Orders = new Schema({
  customer_id: String,
  status: String,
  order_date: Date,
  shipping_address: String,
  billing_address: String,
  phone_number: {
    type: String,
  },
  payment_method: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  payment: {
    type: Object,
    default: {},
  },
  ship_date: Date,
  discount_code: String,
  store_id: String,
  staff_id: String,
  order_items: {
    type: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: "products" },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  //@ts-ignore
  modificationNote: [ModificationNote],
});

export default mongoose.model("orders", Orders);
