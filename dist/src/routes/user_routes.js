"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const userController_1 = require("../controllers/userController");
class UserRoutes {
    constructor() {
        this.userController = new userController_1.UserController();
    }
    route(app) {
        app.post('/api/user', (req, res) => {
            this.userController.createUser(req, res);
        });
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
