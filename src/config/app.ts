import { AuthRoute } from "./../routes/auth_routes";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import environment from "../environment";
import { UserRoutes } from "../routes/user_routes";
import { CommonRoutes } from "../routes/common_routes";
import { ProductRoutes } from "../routes/product_routes";
import { OrderRoutes } from "../routes/order_routes";

import * as cors from "cors";
import * as cookieParser from "cookie-parser";

class App {

  public app: express.Application;
  public mongoUrl: string = "mongodb://localhost:27017/" + environment.getDBName();

  private test_routes: UserRoutes = new UserRoutes();
  private common_routes: CommonRoutes = new CommonRoutes();
  private auth_route: AuthRoute = new AuthRoute();
  private product_routes: ProductRoutes = new ProductRoutes();
  private order_routes: OrderRoutes = new OrderRoutes();
  constructor() {
    this.app = express();
    this.config();

    this.mongoSetup();
    this.auth_route.route(this.app);
    this.order_routes.route(this.app);
    this.product_routes.route(this.app);
    this.test_routes.route(this.app);
    this.common_routes.route(this.app);

  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    require("dotenv").config();
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(cors());
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
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
      });
  }

}
export default new App().app;
