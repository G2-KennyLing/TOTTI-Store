import { Request, Response } from "express";
import {
  insufficientParameters,
  mongoError,
  successResponse,
  failureResponse,
} from "../modules/common/service";
import { IOrder } from "../modules/orders/model";
import OrderService from "../modules/orders/service";

export class OrderController {
  private ordersService: OrderService = new OrderService();

  public getAllOrders(req: Request, res: Response) {
    const orderFilter = {};
    this.ordersService.filterAllOrder(
      orderFilter,
      (err: any, orderData: IOrder) => {
        if (err) {
          mongoError(err, res);
        } else {
          successResponse("Get all orders successful", orderData, res);
        }
      }
    );
  }

	public getAllOrders(req: Request, res: Response) {
		const orderFilter = {};
		this.ordersService.filterAllOrder(orderFilter, (err: any, orderData: IOrder) => {
			if (err) {
				mongoError(err, res);
			} else {
				successResponse("Get all orders successful", orderData, res);
			}
		});
	}

	public getAnOrders(req: Request, res: Response) {
		const orderId = { _id: req.params.id };
		this.ordersService.filterAllOrder(orderId, (err: any, orderData: IOrder) => {
			if (!orderData) {
				failureResponse("Not Found ", orderData, res);
			} else {
				successResponse("Get an orders successful", orderData, res);
			}
		});
	}

	public createdOrder(req: Request, res: Response) {
		if (req.body.customer_id && req.body.store_id && req.body.staff_id && req.body.order_items) {
			const orderParams: IOrder = {
				customer_id: req.body.customer_id,
				order_date: new Date(),
				discount_code: req.body.discount_code,
				store_id: req.body.store_id,
				staff_id: req.body.staff_id,
				order_items: req.body.order_items,
			}
			this.ordersService.createOrder(orderParams, (err: any, orderData: IOrder) => {
				if (err) {
					mongoError(err, res)
				} else {
					successResponse("Order success", orderData, res)
				}
			})
		} else {
			insufficientParameters(res);
		}
	}

}
