import { IUser } from "./model";
import users from "./schema";

export default class UserService {
  public createUser(userParams: IUser, callback: any) {
    const _session = new users(userParams);
    _session.save(callback);
  }

  public filterUser(query: any, callback: any) {
    users.findOne(query, callback);
  }

  public updateUser(userParams: IUser, callback: any) {
    const query = { _id: userParams._id };
    users.findOneAndUpdate(query, userParams, callback);
  }

  public updateToken(userParams: IUser, callback: any) {
    const query = { email: userParams.email };
    users.findOneAndUpdate(query, userParams, callback);
  }

  public deleteUser(_id: String, callback: any) {
    const query = { _id: _id };
    users.deleteOne(query, callback);
  }
}
