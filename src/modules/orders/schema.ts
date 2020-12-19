import { date } from "joi";
import * as mongoose from "mongoose";
import { ModificationNote } from "../common/model";

const Schema = mongoose.Schema;
interface order_item {
	product_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: "products"
	},
	quantity: Number
}
const Orders = new Schema({
<<<<<<< HEAD
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
=======
	customer_id : {
		type: Schema.Types.ObjectId,
		ref: "users",
		required: true
	},
	status: {
		type: Number,
		enum:[0,1,2],
		default:0
	},
	order_date: Date,
	ship_date: Date,
	discount_code: String,
	store_id: Number,
	staff_id: Number,
	order_items: {
		type: [{
			product_id: Schema.Types.ObjectId,
			quantity: Number
		}],
		required: true
	},
	//@ts-ignore
	modificationNote: [ModificationNote]
>>>>>>> develop
});

export default mongoose.model("orders", Orders);
