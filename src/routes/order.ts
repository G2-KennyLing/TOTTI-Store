import { Application, Request, Response } from 'express';
import { OrderController } from '../controllers/orderController';

export class OrderRoutes {

	private orderController: OrderController = new OrderController();

	public route(app: Application) {

		app.post('/orders/create', (req: Request, res: Response) =>{
			this.orderController.createdOrder(req, res);
		});

		app.get('/orders/:id', (req: Request, res: Response) =>{
			this.orderController.getAnOrders(req, res);
		});

		app.get('/orders', (req: Request, res: Response) =>{
			this.orderController.getAllOrders(req, res);
		});

	}
}