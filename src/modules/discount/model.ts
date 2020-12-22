import { ModificationNote } from "../common/model";

export interface IDiscount{
    _id?: String,
    discount_code: String,
    title: String,
    description: String,
    begin: Date,
    end: Date,
    discount: Number
    modificationNotes: ModificationNote[]
}