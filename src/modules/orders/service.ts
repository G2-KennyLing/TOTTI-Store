import { IOrder } from './model';
import orders from './schema';

export default class OrderService {

	public filterAllOrder(query: any, callback: any) {
		orders.find(query, callback);
	}

	public filterAnOrder(query: any, callback: any){
		orders.findById(query, callback);
	}

	public createOrder(orderParams: IOrder, callback: any) {
		const ordersNew = new orders(orderParams);
		ordersNew.save(callback); 
	}
}