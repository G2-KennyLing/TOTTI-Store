import { Iarticles } from './model';
import articles from './schema';


export default class ArticlesService {

	public createArticles(articlesParams: Iarticles, callback: any) {
		const newArticles = new articles(articlesParams);
		newArticles.save(callback);
	}

	public updateArticles(articlesParams: Iarticles, callback: any){
		const query = { _id: articlesParams._id };
		articles.findOneAndUpdate(query, articlesParams, callback);
	}

	public deleteArticles(_id: String, callback: any) {
		const query = {_id: _id};
		articles.deleteOne(query, callback);
	}

}
