import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IOrder } from '../modules/orders/model';
import OrderService from '../modules/orders/service';

export class OrderController {

	private ordersService: OrderService = new OrderService();

	public getAllOrders(req: Request, res: Response) {
		const orderFilter = { };
		this.ordersService.filterAllOrder(orderFilter, (err: any, orderData: IOrder) => {
			if (err) {
				mongoError(err, res);
			  } else {
				successResponse("Get all orders successful", orderData, res);
			  }
		});
		
	}

}