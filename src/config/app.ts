import { AuthRoute } from "./../routes/auth_routes";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import environment from "../environment";
import { UserRoutes } from "../routes/user_routes";
import { CommonRoutes } from "../routes/common_routes";
import { ProductRoutes } from "../routes/product_routes";
var session = require("express-session");
let MongoStore = require('connect-mongo')(session);

class App {

  public app: express.Application;
  public mongoUrl: string = "mongodb://localhost:27017/" + environment.getDBName();

  private test_routes: UserRoutes = new UserRoutes();
  private common_routes: CommonRoutes = new CommonRoutes();
  private auth_route: AuthRoute = new AuthRoute();
  private product_routes: ProductRoutes = new ProductRoutes();
  constructor() {
    this.app = express();
    this.config();

    this.mongoSetup();
    this.auth_route.route(this.app);
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
    this.app.use(session(
      {
        secret: "test",
        resave: false,//we are telling store not to open any new connection but use existing connection instead
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        cookie: { maxAge: 180 * 60 * 1000 }//min sec milisec cookie how much long is session
      }))
      this.app.use((req,res,next)=>{
        res.locals.session = req.session
        next();
       });
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
