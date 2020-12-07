import { ModificationNote } from "../common/model";
enum role {
  USER = 0,
  EDITOR,
  ADMIN,
}
export interface IUser {
  _id?: String;
  name: {
    firstName: String;
    lastName: String;
  };
  cart?: any[];
  email: String;
  password: String;
  hashed_password?: String;
  salt?: Number;
  phoneNumber: String;
  gender: Boolean;
  role?: role;
  isVerified?: Boolean;
  isDeleted?: Boolean;
  modificationNotes: ModificationNote[]
}
