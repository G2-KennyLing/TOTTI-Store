import { AuthController } from "./../controllers/authController";
import { Application, NextFunction, Request, Response } from "express";

export class AuthRoute {
  private authController: AuthController = new AuthController();
  public route(app: Application) {
    app.post(
      "/api/signup",
      (req: Request, res: Response, next: NextFunction) => {
        this.authController.signup(req, res, next);
      }
    );
  }
}
