import { Application, Request, Response } from 'express';
import { orderController } from '../controllers/orderController';

export class OrderRoutes {

	private  orderController: orderController = new orderController;

	public route(app: Application) {

		app.post('/ordersList', (req: Request, res: Response) =>{
			this.orderController.addOrder(req, res);
		});

		app.post('/ordersDetail', (req: Request, res: Response) =>{
			this.orderController.addOrder(req, res);
		});
	}
}