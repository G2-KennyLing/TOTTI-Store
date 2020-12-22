import { Response, Request } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';

export class PaymentController {
	public createPayment(req: Request, res: Response) {
		let ipAddr = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress 

		let config = require('config');
		let dateFormat = require('dateformat');

		let tmnCode = config.get('vnp_TmnCode');
		let secretKey = config.get('vnp_HashSecret');
		let vnpUrl = config.get('vnp_Url');
		let returnUrl = config.get('vnp_ReturnUrl');

		let date = new Date();

		let createDate = dateFormat(date, 'yyyymmddHHmmss');
		let orderId = dateFormat(date, 'HHmmss');
		let amount = req.body.amount;
		let bankCode = req.body.bankCode;

		var orderInfo = req.body.orderDescription;
		var orderType = req.body.orderType;
		var locale = 'vn';
		var currCode = 'VND';
		var vnp_Params = {};
		vnp_Params['vnp_Version'] = '2';
		vnp_Params['vnp_Command'] = 'pay';
		vnp_Params['vnp_TmnCode'] = tmnCode;
		// vnp_Params['vnp_Merchant'] = ''
		vnp_Params['vnp_Locale'] = locale;
		vnp_Params['vnp_CurrCode'] = currCode;
		vnp_Params['vnp_TxnRef'] = orderId;
		vnp_Params['vnp_OrderInfo'] = orderInfo;
		vnp_Params['vnp_OrderType'] = orderType;
		vnp_Params['vnp_Amount'] = amount * 100;
		vnp_Params['vnp_ReturnUrl'] = returnUrl;
		vnp_Params['vnp_IpAddr'] = ipAddr;
		vnp_Params['vnp_CreateDate'] = createDate;
		vnp_Params['vnp_BankCode'] = bankCode;

		vnp_Params = sortObject(vnp_Params);

		var querystring = require('qs');
		var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

		var sha256 = require('sha256');

		var secureHash = sha256(signData);

		vnp_Params['vnp_SecureHashType'] =  'SHA256';
		vnp_Params['vnp_SecureHash'] = secureHash;
		vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });

		//Neu muon dung Redirect thi dong dong ben duoi
		res.status(200).json({code: '00', data: vnpUrl})

		function sortObject(o) {
			var sorted = {},
				key, a = [];

			for (key in o) {
				if (o.hasOwnProperty(key)) {
					a.push(key);
				}
			}

			a.sort();

			for (key = 0; key < a.length; key++) {
				sorted[a[key]] = o[a[key]];
			}
			return sorted;
		}

	}
}
