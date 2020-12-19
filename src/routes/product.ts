import { Application, Request, Response } from "express";
import { ProductController } from "../controllers/productController";

export class ProductRoutes {
  private productController: ProductController = new ProductController();

  public route(app: Application) {
    // Noted: migration DB in nodejs with typescript.

    app.get("/category/:category_id", (req: Request, res: Response) => {
      this.productController.getCategory(req, res);
    });

    app.post("/product", (req: Request, res: Response) => {
      this.productController.createProduct(req, res);
    });

    //Product_Type: {url}/product?Product_Type=aothun&Product_type=gom
    //Product_Type: {url}/product
    app.get("/product", (req: Request, res: Response) => {
      this.productController.getAllProducts(req, res);
    });

    app.get("/category", (req: Request, res: Response) => {
      this.productController.getProductByCategoryType(req, res);
    });

    app.get("/product/:id", (req: Request, res: Response) => {
      this.productController.getProduct(req, res);
    });
  }
}
