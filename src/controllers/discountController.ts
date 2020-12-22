import {Request, Response} from "express";
import {
    insufficientParameters,
    mongoError,
    successResponse,
    failureResponse,
} from "../modules/common/service";
import {IDiscount} from "../modules/discount/model";
import DiscountService from "../modules/discount/service";
import express  = require("express");

export class DiscountController {
    private discountService: DiscountService = new DiscountService();

    public getAllDiscount(req: Request, res: Response){
        this.discountService.getAllDiscount({},(err: Error, discountData: IDiscount) =>{
            if(err){
                return mongoError(err, res);
            }
            return successResponse("get all discount successfull", discountData, res);
        })
    }
    public createDiscount(req: Request, res: Response){
        const {discount_code, title, description, begin, end, discount} = req.body;
        if(!(discount_code && title && description && begin && end && discount)){
            return insufficientParameters(res);
        }
        const discountParams: IDiscount = {
            discount_code,
            title,
            description,
            begin,
            end,
            discount,
            modificationNotes: [{
                modifiedOn: new Date(),
                modifiedBy: null,
                modificationNote: "New discout created"
            }]
        }
        this.discountService.createDiscount(discountParams, (err: Error, discountData:IDiscount) =>{
            if(err){
                return mongoError(err, res)
            }
            return successResponse("create successfull", discountData, res);
        })
    }
    public updateDiscount(req:Request, res:Response){
        const {discount_code, title, description, begin, end, discount} = req.body;
        const _id = req.params.id;
        if(!(discount_code && title && description && begin && end && discount)){
            return insufficientParameters(res);
        }
        const discountParams : IDiscount = {
            _id:_id,
            discount_code,
            title,
            description,
            begin,
            end,
            discount,
            modificationNotes:[{
                modifiedOn:new Date(),
                modifiedBy: null,
                modificationNote: "discount updated"
            }]
        }
        this.discountService.updateDiscount(discountParams, (err: Error, discountData: IDiscount) =>{
            if(err){
                return mongoError(err, res);
            }
            if(! discountData){
                return failureResponse("Discount is not found", {}, res);
            }
            return successResponse("update discont successfull", discountData, res);
        })
    }
    public deleteDiscount(req: Request, res:Response){
        const _id = req.params.id;
        this.discountService.deleteDiscount(_id, (err: Error, deleteDetails: any) =>{
            if(err){
                return mongoError(err, res);
            }
            if(deleteDetails.deletedCount !== 0){
                return successResponse("delete discount successfull", null, res);
            }
            return failureResponse("Invalid discount", null, res);
        })
    }
}