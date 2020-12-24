import { Application, Request, Response } from "express";
import { StoreController} from "../controllers/storeController";
import { AuthController } from "../controllers/authController";

export class StoreRouter{
    private storeController: StoreController = new StoreController();
    private authController : AuthController = new AuthController();

    public router(app: Application){
        app.post("/store/create",
        this.authController.isSignIn,
        this.authController.isEditor, 
        (req: Request, res: Response) =>{
            this.storeController.createStore(req, res);
        });
        app.put("/store/:id",
        this.authController.isSignIn,
        this.authController.isEditor,
         (req: Request, res: Response) =>{
            this.storeController.updateStore(req, res);
        });
        app.delete("/store/:id",
        this.authController.isSignIn,
        this.authController.isEditor,
         (req:Request, res:Response) =>{
            this.storeController.deleteStore(req, res);
        });
        app.get("/store",
        (req, res) =>{
            this.authController.isSignIn,
            this.authController.isEditor,
            this.storeController.getAllStore(req, res);
        });
    }
    
}