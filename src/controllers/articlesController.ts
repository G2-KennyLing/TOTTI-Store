import { Response, Request } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { Iarticles } from '../modules/articles/model';
import articles from '../modules/articles/schema'; 

export class ArticlesController {

	public createArticles(req: Request, res: Response) {
		const article = new articles({
			name: req.body.name,
			description: req.body.description,
			summary: req.body.summary,
			body: req.body.body,
			image: req.body.image,
			user_id: req.body.user_id
		});
		article.save();
		res.send("Created articles success");
	}

	public updateArticles(req: Request, res: Response, next) {
		articles.updateOne({ _id: req.params.id }, req.body)
		.then(() => res.redirect('./articles'))
		.catch(next);
	}

	public deleteArticles(req: Request, res: Response, next) {
		articles.deleteOne({ _id: req.params.id }, req.body)
		.then(() => res.json({
			mess : "Deleted articles success"
		}))
		.catch(next);
	}
}