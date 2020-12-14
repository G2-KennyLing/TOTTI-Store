import { date } from "joi";
import * as mongoose from "mongoose";
import { ModificationNote } from "../common/model";

const Schema = mongoose.Schema;

const Orders = new Schema({
  customer_id: String,
  status: String,
  order_date: Date,
  shipping_address: String,
  billing_address: String,
  payment_method: {
    type: String,
    enum: ["Paypal", "VNPay", "Visa"],
    required: true,
  },
  ship_date: Date,
  discount_code: String,
  store_id: String,
  staff_id: String,
  order_items: [{ type: Schema.Types.ObjectId, ref: "products" }],
  //@ts-ignore
  modificationNote: [ModificationNote],
});

export default mongoose.model("orders", Orders);
