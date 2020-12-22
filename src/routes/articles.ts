import { Application, Request, Response } from 'express';
import { ArticlesController } from '../controllers/articlesController';
import bodyParser = require('body-parser');
import { check, validationResult } from "express-validator";

export class ArticlesRouters {

	private articlesController: ArticlesController = new ArticlesController();

	public route(app: Application) {
		let urlencodedParser = bodyParser.urlencoded({ extended: false })

		app.post('/articles/create', urlencodedParser, [
			check('name', 'Tiêu đề không được ngắn quá dưới 10 kí tự').notEmpty(),
			check('description', 'Mô tả không được dài quá 50 kí tự').notEmpty(),
			check('summary', 'Trường này không được bỏ trống').notEmpty(),
			check('body', 'Trường này không được bỏ trống').notEmpty(),
			check('image', 'Trường này không được bỏ trống').notEmpty()
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