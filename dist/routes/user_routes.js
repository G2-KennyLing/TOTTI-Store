"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const userController_1 = require("../controllers/userController");
class UserRoutes {
    constructor() {
        this.userController = new userController_1.UserController();
    }
    route(app) {
        app.post('/api/login', (req, res) => {
            this.userController.loginUser(req, res);
        });
        app.post('/api/register', (req, res) => {
            this.userController.createUser(req, res);
        });
        // app.post('/api/auth/signup', (req: Request, res: Response) => {
        // 	this.userController.createUser(req, res);
        // });
        // app.post('/api/auth/login', (req: Request, res: Response) => {
        // 	this.userController.createUser(req, res);
        // });
        app.get('/api/verify/:token', (req, res) => {
            this.userController.verifyUser(req, res);
        });
        app.get('/api/user/:id', (req, res) => {
            this.userController.getUser(req, res);
        });
        app.put('/api/user/:id', (req, res) => {
            this.userController.updateUser(req, res);
        });
        app.delete('/api/user/:id', (req, res) => {
            this.userController.deleteUser(req, res);
        });
    }
}
exports.UserRoutes = UserRoutes;
