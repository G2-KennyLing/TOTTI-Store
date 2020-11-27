import { Application, Request, Response } from 'express';
import { UserController } from '../controllers/userController';

export class UserRoutes {

	private userController: UserController = new UserController();

	public route(app: Application) {
		
		app.post('/api/login', (req: Request, res: Response) => {
			this.userController.loginUser(req, res);
		});

		app.post('/auth/signup', (req: Request, res: Response) => {
			this.userController.createUser(req, res);
		});

		// app.post('/api/auth/signup', (req: Request, res: Response) => {
		// 	this.userController.createUser(req, res);
		// });

		// app.post('/api/auth/login', (req: Request, res: Response) => {
		// 	this.userController.createUser(req, res);
		// });

		app.get('/auth/verify/:token', (req: Request, res: Response) =>{
			this.userController.verifyUser(req, res);
		});

		app.get('/auth/:id', (req: Request, res: Response) => {
			this.userController.getUser(req, res);
		});

		app.put('/auth/:id', (req: Request, res: Response) => {
			this.userController.updateUser(req, res);
		});

		app.delete('/auth/:id', (req: Request, res: Response) => {
			this.userController.deleteUser(req, res);
		});
		app.get('/api/verify/refreshtoken/:refreshToken', (req: Request, res: Response) => {
			this.userController.refreshToken(req,res);
		})
	}
}