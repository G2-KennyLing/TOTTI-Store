import { Application, Request, Response } from 'express';
import { UserController } from '../controllers/userController';

export class UserRoutes {

	private userController: UserController = new UserController();

	public route(app: Application) {

		// app.post('/api/login', (req: Request, res: Response) => {
		// 	this.userController.loginUser(req, res);
		// });

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

		app.put('/forgot-password', (req: Request, res: Response) =>{
			this.userController.forgotPassword(req, res);
		})

		app.get('/reset/:token',(req: Request, res: Response) => {
			this.userController.resetPassword(req, res);
		})

		app.post('/reset/:token',(req: Request, res: Response) => {
			this.userController.confirmPassword(req, res);
		})
		
	}
}