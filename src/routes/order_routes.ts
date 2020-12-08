import { Application, Request, Response } from 'express';
import { OrderController } from '../controllers/orderController';

export class OrderRoutes {

	private orderController: OrderController = new OrderController();

	public route(app: Application) {

		// app.get('/orders', (req: Request, res: Response) =>{
		// 	// List orders
		// 	this.orderController.getOrder(req, res);
		// });

		// app.post('/orders', (req: Request, res: Response) =>{
		// 	// List orders
		// 	this.orderController.postOrder(req, res);
		// });

		// app.get('/orders', (req: Request, res: Response) =>{
		// 	this.orderController.getFirstOrder(req, res);
		// });

		app.get('/orders/:id', (req: Request, res: Response) =>{
			this.orderController.getAllOrders(req, res);
		});

	}
}