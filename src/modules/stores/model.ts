import { ModificationNote } from "../common/model";

export interface IStore{
    _id?: String,
    name: String,
    address: String,
    phoneNumber: String,
    email:String,
    modificationNotes: ModificationNote[]
}