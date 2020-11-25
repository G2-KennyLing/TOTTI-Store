
import { IToken } from './model';
import tokens from './schema';

export default class TokenService {

	public createToken(token_params: IToken, callback: any) {
		const _token = new tokens(token_params);
		_token.save(callback);
	}
	
	public filterToken(query: any, callback: any) {
		tokens.findOne(query, callback);
	}

}