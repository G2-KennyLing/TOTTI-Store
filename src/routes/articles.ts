import { Application, Request, Response } from 'express';
import { ArticlesController } from '../controllers/articlesController';

export class ArticlesRouters {

	private articlesController: ArticlesController = new ArticlesController();

	public route(app: Application) {

		app.post('/articles/create', (req: Request, res:Response) => {
			this.articlesController.createArticles(req, res);
		});

		app.put('/articles/:id', (req: Request, res:Response, next) => {
			this.articlesController.updateArticles(req, res, next);
		});

		app.delete('/articles/:id', (req: Request, res:Response, next) => {
			this.articlesController.deleteArticles(req, res, next);
		});
	}
}