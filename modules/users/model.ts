import { ModificationNote } from "../common/model";

export interface IUser {
    _id?: String;
    name: {
        first_name: String;
        middle_name: String;
        last_name: String;
    };
    email: String;
    password: String;
    phone_number: String;
    gender: String;
    is_verified?: Boolean;
    is_deleted?: Boolean;
    modification_notes: ModificationNote[]
}