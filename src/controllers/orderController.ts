const dateformat = require("dateformat");
import { Request, Response } from "express";
import {
  insufficientParameters,
  mongoError,
  successResponse,
  failureResponse,
} from "../modules/common/service";
import { IOrder } from "../modules/orders/model";
import OrderService from "../modules/orders/service";
const sha256 = require("sha256");
import app from "config/app";
import ProductService from "../modules/products/service";
const queryString = require("qs");
require("dotenv").config();
const sortObject = (o: any): any => {
  var sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
};
export class OrderController {
  private ordersService: OrderService = new OrderService();
  private productService: ProductService = new ProductService();
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

  public getAnOrders(req: Request, res: Response) {
    const orderId = { _id: req.params.id };
    this.ordersService.filterAllOrder(
      orderId,
      (err: any, orderData: IOrder) => {
        if (!orderData) {
          failureResponse("Not Found ", orderData, res);
        } else {
          successResponse("Get an orders successful", orderData, res);
        }
      }
    );
  }
  public async createOnlinePaymentOrder(req: Request, res: Response) {
    try {
      const vnp_IpAddr =
        req.headers["x-forward-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
      const {
        order_items,
        vnp_BankCode,
        customer_id,
        shipping_address,
        billing_address,
        phone_number,
        payment_method,
        store_id,
        staff_id,
      } = req.body;
      if (order_items && order_items.length > 0 && vnp_BankCode) {
        const idArray = order_items.map((item) => item.product_id);
        const products = await this.productService
          .asyncFilterProduct({ _id: { $in: idArray } })
          .exec();
        const newOrder = await this.ordersService.asyncCreateOrder({
          customer_id,
          shipping_address,
          billing_address,
          phone_number,
          payment_method,
          store_id,
          staff_id,
          order_items,
        });
        const { _id } = newOrder;
        const vnp_Amount =
          products.reduce((pre, prod) => {
            return (
              pre +
              //@ts-ignore
              prod.price_sales *
                order_items.find((prd) => prd.product_id == prod._id).quantity
            );
          }, 0) * 100;
        const host = req.headers.host;
        const vnp_ReturnUrl = `http://${host}${process.env.VNPAY_RETURN}/${_id}`;
        let vnp_Params = {
          vnp_Version: 2,
          vnp_Command: "pay",
          vnp_TmnCode: process.env.VNPAY_TMNCODE,
          vnp_Amount,
          vnp_Locale: "vn",
          vnp_CurrCode: "VND",
          vnp_TxnRef: dateformat(new Date(), "HHmmss"),
          vnp_OrderInfo: `TOTTI STORE payment, cost: ${vnp_Amount / 100}VND`,
          vnp_OrderType: 25000,
          vnp_IpAddr,
          vnp_BankCode,
          vnp_CreateDate: dateformat(new Date(), "yyyymmddHHmmss"),
          vnp_ReturnUrl,
        };
        vnp_Params = sortObject(vnp_Params);
        const signData =
          process.env.VNPAY_SECRET +
          queryString.stringify(vnp_Params, { encode: false });

        const vnp_SecureHash = sha256(signData);
        vnp_Params["vnp_SecureHashType"] = "SHA256";
        vnp_Params["vnp_SecureHash"] = vnp_SecureHash;

        const vnpayURL =
          process.env.VNPAY_URL +
          `?${queryString.stringify(vnp_Params, {
            encode: true,
          })}`;
        return res.status(200).json({
          message: "follow this url",
          data: vnpayURL,
          vnp_Params,
        });
      } else return insufficientParameters(res);
    } catch (error) {
      console.log(error);
      return res.json({
        error,
      });
    }
  }
  public async vnpay_return(req: Request, res: Response) {
    try {
      let vnp_Params = req.query;
      const { vnp_SecureHash } = vnp_Params;
      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];
      const { orderId } = req.params;

      vnp_Params = sortObject(vnp_Params);

      const tmnCode = process.env.VNPAY_TMNCODE;
      const secretKey = process.env.VNPAY_SECRET;
      const signData =
        secretKey + queryString.stringify(vnp_Params, { encode: false });
      const checkSum = sha256(signData);

      if (vnp_SecureHash === checkSum) {
        const newOrder = await this.ordersService.asycUpdateOrder(orderId, {
          payment: vnp_Params,
        });
        console.log(newOrder);
        return res.send("<h1>Thanh toan thanh cong </h1>");
      }
      return res.send("<h1>Thanh toan that bai </h1>");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
  public vnpay_inp(req: Request, res: Response) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    var secretKey = process.env.VNPAY_SECRET;
    var signData =
      secretKey + queryString.stringify(vnp_Params, { encode: false });

    var checkSum = sha256(signData);

    if (secureHash === checkSum) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];
      res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  }
  public createdOrder(req: Request, res: Response) {
    if (
      req.body.customer_id &&
      req.body.status &&
      req.body.order_date &&
      req.body.discount_code &&
      req.body.store_id &&
      req.body.staff_id
    ) {
      const orderParams: IOrder = {
        customer_id: req.body.customer_id,
        status: req.body.status,
        // name
        order_date: req.body.order_date,
        discount_code: req.body.discount_code,
        address: req.body.address,
        phone_number: req.body.phone_number,
        payment_method: req.body.payment_method,
        order_items: req.body.order_items,
      };
      this.ordersService.createOrder(
        orderParams,
        (err: any, orderData: IOrder) => {
          if (err) {
            mongoError(err, res);
          } else {
            successResponse("Order success", orderData, res);
          }
        }
      );
    } else {
      insufficientParameters(res);
    }
  }
}
