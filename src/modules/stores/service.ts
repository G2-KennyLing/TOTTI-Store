import { IStore } from "./model";
import store from "./schema";

export default class StoreService{
    public createStore(storeParams: IStore, callback: any){
        const _session = new store(storeParams);
        _session.save(callback);
    }
    public updateStrore( storeParams: IStore, callback: any){
        const query = {_id: storeParams._id};
        store.findOneAndUpdate(query, storeParams,{ new: true }, callback);
    }
    public deleteStore(_id: String, callback: any){
        const query = {_id: _id};
        store.deleteOne(query, callback);
    }
    public findOne(_id: String, callback: any){
        const query = {_id: _id};
        store.findById(_id, callback);
    }
    public getAllStore(query: any, callback: any){
        store.find(query, callback)
    }
}