import { Application, Request, Response } from 'express';
import { PaymentController } from "../controllers/paymentController";

export class PaymentRouters {

	private paymentController: PaymentController = new PaymentController();

	public route(app: Application) {
		app.get('/create_payment_url', (req: Request, res: Response, next) => {
			this.paymentController.createPayment(req, res);
		})
	}
	
}