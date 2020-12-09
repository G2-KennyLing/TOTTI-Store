import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IProduct } from '../modules/products/model';
import ProductService from '../modules/products/service';

export class ProductController {

  private productService: ProductService = new ProductService();

  public getAllProducts(req: Request, res: Response) {
    const productFilter = {};
    this.productService.filterAllProduct(productFilter, (err: any, productData: IProduct) => {
      if (err) {
        mongoError(err, res);
      } else {
        successResponse("Get all product successful", productData, res);
      }
    });
  }

  public getProduct(req: Request, res: Response) {
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

  public createProduct(req: Request, res: Response) {
    if (req.body.name && req.body.description && req.body.unit_price && req.body.price_sales && req.body.discount && req.body.SKU && req.body.quantity && req.body.size && req.body.color && req.body.product_image && req.body.product_image.link && req.body.provider_id && req.body.category_id && req.body.store_id) {

      const productParams: IProduct = {
        name: req.body.name,
        description: req.body.description,
        unit_price: req.body.unit_price,
        price_sales: req.body.price_sales,
        discount: req.body.discount,
        SKU: req.body.SKU,
        quantity: req.body.quantity,
        size: req.body.size,
        color: req.body.color,
        product_image: {
            link: req.body.product_image.link,
        },
        category_id: req.body.category_id,
        provider_id: req.body.provider_id,
        store_id: req.body.store_id,
        //@ts-ignore
        modificationNotes: [{
          modifiedOn: new Date(Date.now()),
          modifiedBy: null,
          modificationNote: 'New product created'
      }]
      }
      this.productService.createProduct(productParams, (err: any, productData: IProduct) => {
        if (err) {
            mongoError(err, res);
        } else {
            successResponse('create product successfull', productData, res);
        }
    });
    }
    else {
      // error response if some fields are missing in request body
      insufficientParameters(res);
  }
  }

  public getCategory(req: Request, res: Response) {
    const productFilter = { category_id: req.params.category_id };
    this.productService.filterProductCategory(productFilter, (err: any, productData: IProduct) => {
      if (err) {
        mongoError(err, res);
      } else {
        successResponse("Get product category successful", productData, res);
      }
    });
  }

  public getProductByCategoryType(req: Request, res: Response) {
    const productFilter = { category_id: { $in: [req.query.category, req.query.category1, req.query.category2] } };
    this.productService.filterAllProductByCategory(productFilter, (err: any, productData: IProduct) => {
      if (err) {
        mongoError(err, res);
      } else {
        successResponse("Get product category successful", productData, res);
      }
    });
  }

}