import { Request, Response } from "express";
import {
    insufficientParameters,
    mongoError,
    successResponse,
    failureResponse,
} from "../modules/common/service";
import { IStore } from "../modules/stores/model";
import StoreService from "../modules/stores/service";
import express = require("express");

export class StoreController {
    private storeService: StoreService = new StoreService();

    public createStore(req: Request, res: Response) {
        if (req.body.name && req.body.address && req.body.phoneNumber && req.body.email) {
            const storeParams: IStore = {
                name: req.body.name,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                modificationNotes: [{
                    modifiedOn: new Date,
                    modifiedBy: null,
                    modificationNote: "New Store created"
                }]
            }
            this.storeService.createStore(storeParams, (err: any, storeData: IStore) => {
                if (err) {
                    console.log(err);
                    return mongoError(err, res);
                } else
                    successResponse("create store successfull", storeData, res);
            });
        }
        else return insufficientParameters(res);
    }
    public updateStore(req: Request, res: Response) {
        const { name, address, phoneNumber, email } = req.body;
        if (!(name && address && phoneNumber && email)) {
            return insufficientParameters(res);
        }
        const storeParams: IStore = {
            _id: req.params.id,
            name: name,
            address: address,
            phoneNumber: phoneNumber,
            email: email,
            modificationNotes: [{
                modifiedOn: new Date,
                modifiedBy: null,
                modificationNote: "Store data update"
            }]
        }
        this.storeService.updateStrore(storeParams, (err: any, storeData: IStore) => {
            if (err) {
                return mongoError(err, res);
            }
            if(!storeData) return failureResponse("Store is not found",{},res); 
            else {
                successResponse("Update store successfull", {storeData}, res);
            }
        })

    }
    public deleteStore(req: Request, res: Response) {
        const _id = req.params.id;
        if (!_id) {
            return insufficientParameters(res);
        } else {
            this.storeService.deleteStore(_id, (err: any, deleteDetails: any) => {
                if (err) {
                    return mongoError(err, res);
                }
                if (deleteDetails.deletedCount !== 0) {
                    return successResponse("Delete store succsessfull", null, res);
                }
                return failureResponse("Invalid store", null, res);
            })
        }
    }
}