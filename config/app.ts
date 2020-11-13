import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from 'mongoose';
import environment from "../environment";
import { TestRoutes } from "../routes/user_routes";
import { CommonRoutes } from "../routes/common_routes";


class App {

   public app: express.Application;
   public mongoUrl: string = 'mongodb://localhost:27017/test_db';

   private test_routes: TestRoutes = new TestRoutes();
   private common_routes: CommonRoutes = new CommonRoutes();

   constructor() {
      this.app = express();
      this.config();
      this.mongoSetup();
      this.test_routes.route(this.app);
      this.common_routes.route(this.app);
   }

   private config(): void {
      // support application/json type post data
      this.app.use(bodyParser.json());
      //support application/x-www-form-urlencoded post data
      this.app.use(bodyParser.urlencoded({ extended: false }));
   }

   private mongoSetup(): void {
      mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }).then(() => {
         console.log("Successfully connected to the database");
     }).catch(err => {
         console.log('Could not connect to the database. Exiting now...', err);
         process.exit();
     });
   }

}
export default new App().app;