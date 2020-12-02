import { Application, Request, Response } from 'express';
import { ProductController } from '../controllers/productController';

export class ProductRoutes {
    private productController: ProductController = new ProductController();

    public route(app: Application){

        app.get('/category/:category_id', (req: Request, res: Response) => {
			this.productController.getCategory(req, res);
        });

        app.get('/product/:id', (req: Request, res: Response) => {
			this.productController.getProduct(req, res);
        });
        
    }
}