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
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: "users"  
  },
  status: {
    type: Number,
    enum: [0,1,2],
    default: 0
  },
  order_date: {
    type: Date
  },
  name:{
    type:{
      firstName: String,
      lastName: String
    },
    trim: true
  },
  payment: {
    type: Object,
    default: {},
  },
  address: {
    type: String
  },
  phone_number: {
    type: String,
    trim: true
  },
  payment_method: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  discount_code: {
    type: Schema.Types.ObjectId,
    ref: "discount"
  },
  ship_date: {
    type: Date
  },
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
