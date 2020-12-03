import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { order } from '../modules/orders/model';
import Orders  from '../modules/orders/schema';

export class OrderController {

	public getFirstOrder(req: Request, res: Response){
		console.log("Hello")
	}

}