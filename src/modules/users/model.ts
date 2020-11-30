import { ModificationNote } from "../common/model";

export interface IUser {
  _id?: String;
  name: {
    firstName: String;
    lastName: String;
  };
  email: String;
  password: String;
  phoneNumber: String;
  gender: Boolean;
  isVerified?: Boolean;
  isDeleted?: Boolean;
  modificationNotes: ModificationNote[];
}
