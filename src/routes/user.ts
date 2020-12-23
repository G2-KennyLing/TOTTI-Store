import { Application, Request, Response } from "express";
import { UserController } from "../controllers/userController";
import { AuthController } from "../controllers/authController";

export class UserRoutes {
  private userController: UserController = new UserController();
  private authController : AuthController = new AuthController();

  public route(app: Application) {
    app.post("/user/resetPassword", 
    (req: Request, res: Response) => {
      this.userController.resetPassword(req, res);
    });

    app.post("/user/forgotPassword", (req: Request, res: Response) => {
      this.userController.forgotPassword(req, res);
    });

    app.put("/user/updateUser/:id", 
    this.authController.isSignIn,
    (req: Request, res: Response) => {
      this.userController.updateUser(req, res);
    });

    app.get("/user/getUser/:id", 
    this.authController.isSignIn,
    (req: Request, res: Response) => {
      this.userController.getUser(req, res);
    });

    app.delete("/user/deleteUser/:id",
    this.authController.isSignIn,
    this.authController.isAdmin,
     (req: Request, res: Response) => {
      this.userController.deleteUser(req, res);
    });
    app.post("/user/create", 
    this.authController.isSignIn,
    this.authController.isAdmin,
    (req: Request, res: Response) =>{
      this.userController.createUser(req, res);
    });
    app.put("/user/updateUserByAdmin/:id", 
    this.authController.isSignIn,
    this.authController.isAdmin,
    (req: Request, res: Response) =>{
      this.userController.updateUserByAdmin(req, res);
    });
    app.get("/user/getAll", 
    this.authController.isSignIn,
    this.authController.isAdmin,
    (req: Request, res: Response) =>{
      this.userController.getAllUser(req, res);
    })
  }
}
