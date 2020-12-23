import {IDiscount} from "./model";
import discount from "./schema";

export default class DiscountService{
    public createDiscount(discountParams: IDiscount, callback: any){
        const newDiscount = new discount(discountParams);
        newDiscount.save(callback);
    }
    public updateDiscount(discountParams: IDiscount, callback: any){
        const query= {_id: discountParams._id};
        discount.findOneAndUpdate(query, discountParams,{ new: true }, callback);
    }
    public deleteDiscount(_id: String, callback: any){
        discount.deleteOne({_id}, callback);
    }
    public getAllDiscount(query: any, callback: any){
        discount.find(query, callback);
    }
    public asyncFilterDiscount(query: any){
        return discount.findOne(query);
    }
    public verifyDiscount(discountData: IDiscount, date: Date){
        if(date >=discountData.begin && date <= discountData.end){
            return true
        }
        return false;
    }
}