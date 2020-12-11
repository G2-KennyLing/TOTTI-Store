import { AuthController } from "./../controllers/authController";
import { Application, NextFunction, Request, Response } from "express";
import SignupValidator from "../middleware/validatorResigter";

export class AuthRoute {
  private authController: AuthController = new AuthController();
  private signupValidate: SignupValidator = new SignupValidator();
  public route(app: Application) {
    app.post(
      "/auth/signup",
      this.signupValidate.userSignupValidator,
      this.signupValidate.validateResult,
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
    app.post("/auth/refreshToken", (req: Request, res: Response) => {
      this.authController.refreshToken(req, res);
    });
    app.get("/auth/signout", (req: Request, res: Response) => {
      this.authController.Signout(req, res);
    });

    app.get(
      "/test",
      this.authController.requireSignin,
      (req: Request, res: Response) => {
        //@ts-ignore
        return res.json({ user: req.user });
      }
    );
  }
}
