import { ModificationNote } from "../common/model";

export interface IUser {
	_id?: String;
	name: {
		firstName: String;
		lastName: String;
	};
	email: String;
	password: String;
	resetPasswordToken: String;
	resetPasswordExpires: Date;
	phoneNumber: String;
	gender: String;
	isVerified?: Boolean;
	isDeleted?: Boolean;
	modificationNotes: ModificationNote[]
}