import { order } from './model';
import orders from './schema';

export default class UserService {

	public getFirstOrder(query: any, callback: any) {
		orders.findOne(query, callback);
	}

}