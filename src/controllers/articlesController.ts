import { Response, Request } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { Iarticles } from '../modules/articles/model';
import articles from '../modules/articles/schema'; 

export class ArticlesController {

	public createArticles(req: Request, res: Response) {
		const article = new articles({
			heading: req.body.heading,
			content: req.body.content,
			image: req.body.image,
			author: req.body.author
		});
		article.save();
		res.send("created success");
	}

	public updateArticles(req: Request, res: Response, next) {
		articles.updateOne({ _id: req.params.id }, req.body)
		.then(() => res.redirect('./articles'))
		.catch(next);
	}

	public deleteArticles(req: Request, res: Response, next) {
		articles.deleteOne({ _id: req.params.id }, req.body)
		.then(() => res.json({
			mess : "deleted success"
		}))
		.catch(next);
	}
}