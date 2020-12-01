import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from 'mongoose';
import environment from "../environment";
import { UserRoutes } from "../routes/user_routes";
import { CommonRoutes } from "../routes/common_routes";
import { ProductRoutes } from "../routes/product_routes";

class App {

   public app: express.Application;
   // public mongoUrl: string = 'mongodb://localhost/' + environment.getDBName();
   public mongoUrl: string = 'mongodb://localhost/' + environment.getDBName();

   private product_routes: ProductRoutes = new ProductRoutes();
   private test_routes: UserRoutes = new UserRoutes();
   private common_routes: CommonRoutes = new CommonRoutes();


   constructor() {
	  this.app = express();
	  this.config();
     this.mongoSetup();
     this.product_routes.route(this.app);
	  this.test_routes.route(this.app);
     this.common_routes.route(this.app);
     
   }

   private config(): void {
	  // support application/json type post data
	  this.app.use(bodyParser.json());
	  //support application/x-www-form-urlencoded post data
	  this.app.use(bodyParser.urlencoded({ extended: false }));
   }

   // private mongoSetup(): void {
   //    mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
   // }

   private mongoSetup(): void {
	  mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }).then(() => {
		 console.log("Successfully connected to the database");
	 }).catch(err => {
		 console.log('Could not connect to the database. Exiting now...', err);
		 process.exit();
	 });
   }

   // Cors

}
export default new App().app;