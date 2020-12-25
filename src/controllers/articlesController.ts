import { Response, Request } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { Iarticles } from '../modules/articles/model';
import ArticlesService from '../modules/articles/service';
import articles from '../modules/articles/schema'; 

export class ArticlesController {
	private articlesService: ArticlesService = new ArticlesService();

	public createArticles(req: Request, res: Response) {
		if (req.body.name && req.body.description && req.body.summary
			&& req.body.body && req.body.image) {
			const articlesParams: Iarticles = {
				name: req.body.name,
				description: req.body.description,
				summary: req.body.summary,
				body: req.body.body,
				image: req.body.image,
				user_id: req.body.user_id,
			};
			this.articlesService.createArticles(articlesParams, (err: any, articlesData: Iarticles) =>{
				if (err) {
					mongoError(err, res);
				}else {
					successResponse("Created successful articles", articlesData, res);
				}
			})
		}
	}

	public updateArticles(req: Request, res: Response, next) {
		const { name, description, summary, body, image } = req.body;
		if (!(name && description && summary && body && image)) {
			return insufficientParameters(res)
		}const articlesParams: Iarticles = {
			_id: req.params.id, 
			name: name,
			description: description,
			summary: summary,
			body: body,
			image: image,
			user_id: req.params._id
		}
		this.articlesService.updateArticles(articlesParams, (err: any, articlesData: Iarticles) => {
			if (err) {
				return mongoError(err, res)
			}
			if (!articlesData) {
				return failureResponse("Articles update failed", {}, res)
			}else {
				successResponse("Articles update suceess", { articlesData }, res)
			}
		})
	}

	public deleteArticles(req: Request, res: Response, next) {
		const _id = req.params.id;
		if (!_id) {
			return insufficientParameters(res)
		}else {
			this.articlesService.deleteArticles(_id, (err: any, callback: any) => {
				if (err) {
					return mongoError(err, res);
				}else {
					return successResponse("Deleted success", {}, res)
				}
			})
		}
	}
}