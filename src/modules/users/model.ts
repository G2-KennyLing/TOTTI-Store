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
  phoneNumber: String;
  gender: Boolean;
  role?: role;
  isDeleted?: Boolean;
  modificationNotes: ModificationNote[];
}
