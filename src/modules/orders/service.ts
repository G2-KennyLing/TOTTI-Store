import { IOrder } from './model';
import orders from './schema';

export default class OrderService {

	public filterAllOrder(query: any, callback: any) {
		orders.find(query, callback);
	}
}