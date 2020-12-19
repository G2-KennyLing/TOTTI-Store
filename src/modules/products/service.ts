import { IProduct } from './model';
import products from './schema';

export default class ProductService {

	public createProduct(productParams: IProduct, callback: any) {
		const _session = new products(productParams);
		_session.save(callback);
	}

    public filterProduct(query: any, callback: any) {
		products.findOne(query, callback);
	}

	public filterProductCategory(query: any, callback: any) {
		products.find(query, callback);
	}

	public filterAllProduct(query: any, callback: any) {
		products.find(query, callback);
	}

	public filterAllProductByCategory(query: any, callback: any) {
		products.find(query, callback);
	}


}