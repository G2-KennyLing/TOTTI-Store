import { Application, Request, Response } from "express";
import { UserController } from "../controllers/userController";

export class UserRoutes {
  private userController: UserController = new UserController();

  public route(app: Application) {
    app.post("/user/resetPassword", (req: Request, res: Response) => {
      this.userController.resetPassword(req, res);
    });

    app.post("/user/forgotPassword", (req: Request, res: Response) => {
      this.userController.forgotPassword(req, res);
    });

    app.put("/user/updateUser/:id", (req: Request, res: Response) => {
      this.userController.updateUser(req, res);
    });

    app.get("/user/getUser/:id", (req: Request, res: Response) => {
      this.userController.getUser(req, res);
    });

    app.delete("/user/deleteUser/:id", (req: Request, res: Response) => {
      this.userController.deleteUser(req, res);
    });
  }
}
