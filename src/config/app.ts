import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import environment from "../environment";

import { AuthRoute } from "../routes/auth";
import { UserRoutes } from "../routes/user";
import { ProductRoutes } from "../routes/product";
import { OrderRoutes } from "../routes/order";
import { DiscountRouter } from '../routes/discount';
import { StoreRouter } from "../routes/store";
import { PaymentRouters } from "../routes/payment";
import { ArticlesRouters } from "../routes/articles";
import { CommonRoutes } from "../routes/common";


import * as cors from "cors";
import * as cookieParser from "cookie-parser";

class App {
  public app: express.Application;
  public mongoUrl: string =
    "mongodb://localhost:27017/" + environment.getDBName();

  private auth: AuthRoute = new AuthRoute();
  private user: UserRoutes = new UserRoutes();
  private product: ProductRoutes = new ProductRoutes();
  private discount: DiscountRouter = new DiscountRouter();
  private store: StoreRouter = new StoreRouter();
  private common: CommonRoutes = new CommonRoutes();
  private order: OrderRoutes = new OrderRoutes();
  private payment: PaymentRouters = new PaymentRouters();
  private articles: ArticlesRouters = new ArticlesRouters();

  constructor() {
    this.app = express();
    this.config();
    this.mongoSetup();

    this.auth.route(this.app);
    this.product.route(this.app);
    this.user.route(this.app);
    this.store.router(this.app);
    this.discount.router(this.app);
    this.order.route(this.app);
    this.order.route(this.app);
    this.payment.route(this.app);
    this.articles.route(this.app);
    this.common.route(this.app);
  }

  private config(): void {
    this.app.use(bodyParser.json());
    require("dotenv").config();
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private mongoSetup(): void {
    mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log("Successfully connected to the database");
      })
      .catch((err) => {
        console.log("Could not connect to the database.", err);
        process.exit();
      });
  }
}

export default new App().app;
