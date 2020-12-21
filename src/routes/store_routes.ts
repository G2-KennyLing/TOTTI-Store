import { Application, Request, Response } from "express";
import { StoreController} from "../controllers/storeController";

export class StoreRouter{
    private storeController: StoreController = new StoreController();

    public router(app: Application){
        app.post("/store/createStore", (req: Request, res: Response) =>{
            this.storeController.createStore(req, res);
        });
        app.put("/store/updateStore/:id", (req: Request, res: Response) =>{
            this.storeController.updateStore(req, res);
        });
        app.delete("/store/deleteStore/:id", (req:Request, res:Response) =>{
            this.storeController.deleteStore(req, res);
        })
    }
    
}