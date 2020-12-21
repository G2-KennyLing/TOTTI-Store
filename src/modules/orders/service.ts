import { IOrder } from "./model";
import orders from "./schema";

export default class OrderService {
  public filterAllOrder(query: any, callback: any) {
    orders.find(query, callback);
  }
  public filterAnOrder(query: any, callback: any) {
    orders.findById(query, callback);
  }
  public asyncCreateOrder(orderParams: any) {
    const newOrder = new orders(orderParams);
    return newOrder.save();
  }
  public asycUpdateOrder(orderId: String, updateField: any) {
    return orders.updateOne(
      { _id: orderId },
      { $set: updateField },
      { new: true }
    );
  }
  public createOrder(orderParams: IOrder, callback: any) {
    const ordersNew = new orders(orderParams);
    ordersNew.save(callback);
  }
}
