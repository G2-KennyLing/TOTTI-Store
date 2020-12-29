import { Application, Request, Response } from 'express';
import { CartController } from '../controllers/cartController';

export class CartRoutes {
    private CartController: CartController = new CartController();

    public route(app: Application){

        app.get('/add/:id', (req: Request, res: Response) => {
			this.CartController.addToCart(req, res);
        })

        app.get('/reduce/:id',(req: Request, res: Response)=>{
            this.CartController.reduceByOne(req, res);;
        })

        app.get('/remove/:id', (req: Request, res: Response) => {
            this.CartController.removeItem(req, res);
        })
        
        app.get('/cart', (req: Request, res: Response)=>{
            this.CartController.getCart(req, res);
        })
    }
}