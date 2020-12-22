import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const Discount = new Schema({
    discount_code:{
        type: String,
        required: [true, "discount is required"],
        uppercase: true,
        trim: true
    },
    title:{
        type: String,
        required:[true, 'title discount is required']
    },
    description:{
        type: String,
        required:[true, 'description discount is required']
    },
    begin:{
        type:Date,
        required: [true, 'bigin date discount is required']
    },
    end:{
        type: Date,
        required: [true, "end date discount is required"]
    },
    discount:{
        type: Number,
        required: [true, 'discount is required'],
        max: 1
    }
},{timestamps: true});

export default mongoose.model("discount", Discount);