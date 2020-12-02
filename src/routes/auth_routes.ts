import { AuthController } from "./../controllers/authController";
import { Application, NextFunction, Request, Response } from "express";

export class AuthRoute {
  private authController: AuthController = new AuthController();
  public route(app: Application) {
    app.post(
      "/auth/signup",
      (req: Request, res: Response, next: NextFunction) => {
        this.authController.signup(req, res, next);
      }
    );
    app.post("/auth/signin", (req: Request, res: Response) => {
      this.authController.signin(req, res);
    });
    app.get("/auth/verify/:token", (req: Request, res: Response) => {
      this.authController.verifyEmail(req, res);
    });
    app.get(
      "/test",
      this.authController.requireSignin,
      this.authController.isVerified,
      (req: Request, res: Response) => {
        //@ts-ignore
        return res.json({ user: req.user });
      }
    );
  }
}
