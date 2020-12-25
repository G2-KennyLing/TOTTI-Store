import { Application, Request, Response } from 'express';
import { ArticlesController } from '../controllers/articlesController';
import bodyParser = require('body-parser');
import { check, validationResult } from "express-validator";

export class ArticlesRouters {

	private articlesController: ArticlesController = new ArticlesController();

	public route(app: Application) {
		let urlencodedParser = bodyParser.urlencoded({ extended: false })

		app.post('/articles/create', urlencodedParser, [
			check('name', 'Name is not more than character 10').notEmpty(),
			check('description', 'Description is not more than character 50').notEmpty(),
			check('summary', 'This field not empty').notEmpty(),
			check('body', 'This field not empty').notEmpty(),
			check('image', 'This field not empty').notEmpty()
			], (req: Request, res:Response) => {
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