import { IProduct } from './model';
import products from './schema';

export default class ProductService{

    public filterProduct(query: any, callback: any) {
		products.findOne(query, callback);
	}

	public filterProductCategory(query: any, callback: any) {
		products.find(query, callback);
	}

	public filterAllProduct(query: any, callback: any) {
		products.find(query, callback);
	}
}