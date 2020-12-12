import { AuthController } from "../controllers/authController";
import { Application, NextFunction, Request, Response } from "express";
import SignupValidator from '../middleware/validatorResigter';

export class AuthRoute {
  private authController: AuthController = new AuthController();
  private signupValidate: SignupValidator = new SignupValidator();

  public route(app: Application) {
    app.post("/auth/register",
      this.signupValidate.userSignupValidator,
      this.signupValidate.validateResult,
      (req: Request, res: Response, next: NextFunction) => {
        this.authController.signUp(req, res, next);
      }
    );

    app.post("/auth/login", (req: Request, res: Response) => {
      this.authController.signIn(req, res);
    });

    app.get("/auth/verify/:token", (req: Request, res: Response) => {
      this.authController.verifyEmail(req, res);
    });

    app.post("/auth/refreshToken", (req: Request, res: Response) => {
      this.authController.refreshToken(req, res);
    });

    app.get("/auth/logout", (req: Request, res: Response) => {
      this.authController.signOut(req, res);
    });

    app.get("/test",
      this.authController.isSignIn,
      (req: Request, res: Response) => {
        //@ts-ignore
        return res.json({ user: req.user });
      }
    );
  }
}
