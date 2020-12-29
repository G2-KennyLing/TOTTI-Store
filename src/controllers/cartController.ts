import { Application, NextFunction, Request, Response } from "express";
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
let {Product} = require("../modules/products/schema");
let Cart = require("../modules/carts/model");


export class CartController {

  public addToCart(req: Request, res: Response) {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId)
      .then((product) => {
        cart.add(product, product.id);
        req.session.cart = cart; // express session will automatically save so don't
        //save in the session
        console.log(req.session.cart);
      })
      .catch((e) => {
        return res.redirect("/");
      })

  }

  public reduceByOne(req: Request, res: Response) {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect("/cart");
  }

  public removeItem(req: Request, res: Response) {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeAll(productId);
    req.session.cart = cart;
    res.redirect("/cart");
  }

  public getCart(req: Request, res: Response) {
    if (!req.session.cart) {
      return res.render("cart", { product: null });
    }
    let cart = new Cart(req.session.cart);
    res.render("cart", { product: cart.generateArray(), totalPrice: cart.totalPrice })
  }
}