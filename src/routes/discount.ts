import {Application, Request, Response} from "express";
import { DiscountController} from "../controllers/discountController";
import {AuthController} from "../controllers/authController";

export class DiscountRouter{
    private discountController: DiscountController = new DiscountController();
    private authController : AuthController = new AuthController();

    public router(app: Application){
        app.post("/discount/create",
        this.authController.isSignIn,
        this.authController.isEditor, 
        (req:Request, res: Response) =>{
            this.discountController.createDiscount(req, res)
        });
        app.put("/discount/:id",
        this.authController.isSignIn,
        this.authController.isEditor, 
        (req: Request, res: Response) =>{
            this.discountController.updateDiscount(req, res)
        });
        app.delete("/discount/:id",
        this.authController.isSignIn,
        this.authController.isEditor, 
        (req:Request, res:Response) =>{
            this.discountController.deleteDiscount(req, res)
        });
        app.get("/discount",
        (req:Request, res:Response) =>{
            this.authController.isSignIn,
            this.authController.isEditor,
            this.discountController.getAllDiscount(req, res)
        });
    }
}