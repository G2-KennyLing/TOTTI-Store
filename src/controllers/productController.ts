import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IProduct } from '../modules/products/model';
import ProductService from '../modules/products/service';

export class ProductController{

    private productService: ProductService = new ProductService();

    public getAllProducts(req: Request, res: Response) {
      const productFilter = { };
      this.productService.filterAllProduct(productFilter, (err: any, productData: IProduct) => {
        if (err) {
          mongoError(err, res);
        } else {
          successResponse("Get all product successful", productData, res);
        }
      });
    }

    public getProduct(req: Request, res: Response){
        // if (req.params.id) {
            const productFilter = { _id: req.params.id };
            this.productService.filterProduct(productFilter, (err: any, productData: IProduct) => {
              if (err) {
                mongoError(err, res);
              } else {
                successResponse("Get product successful", productData, res);
              }
            });
          // } else {
          //   insufficientParameters(res);
          // }     
    }

    public getCategory(req: Request, res: Response){
        const productFilter = { category_id : req.params.category_id };
        this.productService.filterProductCategory(productFilter, (err: any, productData: IProduct) => {
          if (err) {
            mongoError(err, res);
          } else {
            successResponse("Get product category successful", productData, res);
          }
        });
    }

    public getProductByCategoryType(req: Request, res: Response){
      const productFilter = { category_id : {$in :[ req.query.category , req.query.category1 ]}};
      this.productService.filterAllProductByCategory(productFilter, (err: any, productData: IProduct) => {
        if (err) {
          mongoError(err, res);
        } else {
          successResponse("Get product category successful", productData, res);
        }
      });
  }

}