import { NextFunction, Request, Response, Router } from "express";
import {
  insufficientParameters,
  mongoError,
  successResponse,
  failureResponse,
} from "../modules/common/service";
import { IUser } from "../modules/users/model";
import sgMail = require("@sendgrid/mail");
import UserService from "../modules/users/service";
import TokenService from "../modules/tokens/service";
import jwt = require("jsonwebtoken");
import { IToken } from "modules/tokens/model";
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export class AuthController {
  private userService: UserService = new UserService();
  private tokenService: TokenService = new TokenService();

  public signup = (req: Request, res: Response, next: NextFunction): void => {
	const { name, email, password, phoneNumber, gender } = req.body;
	const { firstName, lastName } = name || {};
	if (
	  !(firstName && lastName && email && password && phoneNumber && gender)
	) {
	  return insufficientParameters(res);
	}
	const userParams: IUser = {
	  name: {
		firstName,
		lastName,
	  },
	  email,
	  password,
	  phoneNumber,
	  gender,
	  modificationNotes: [
		{
		  modifiedOn: new Date(Date.now()),
		  modifiedBy: null,
		  modificationNote: "New user created",
		},
	  ],
	};
	this.userService.createUser(userParams, (err: any, newUser: IUser) => {
	  if (err) {
		return mongoError(err, res);
	  }
	  const userId: String = newUser._id;
	  jwt.sign(
		{ userId },
		process.env.JWT_VERIFY_MAIL_TOKEN,
		{
		  expiresIn: "10m",
		},
		function (err, token) {
		  if (err) return res.status(400).json({ err });
		  const templateId: string = "d-9aa79e9a022b4f2687cb861c2626792a";
		  console.log(req.headers.host);
		  const msg: sgMail.MailDataRequired = {
			to: <string>newUser.email, // Change to your recipient
			from: {
			  name: "TOTTI STORE", //The display name
			  email: "linhqt1999@gmail.com", //sender
			}, // Change to your verified sender
			subject: "Confirm Account",
			templateId,
			dynamicTemplateData: {
			  verifyLink: `http:\/\/${req.headers.host}\/auth\/verify\/${token}`,
			},
		  };
		  newUser.hashed_password = undefined;
		  newUser.salt = undefined;
		  sgMail
			.send(msg)
			.then(() => {
			  return res.status(200).json({
				message: "Signup Successful",
				newUser,
			  });
			})
			.catch((err) => {
			  console.log(err);
			});
		}
	  );
	});
  };
  public signin = (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!(email && password)) return insufficientParameters(res);
	this.userService.filterUser({ email }, async (err: Error, user: IUser) => {
	  if (err) return mongoError(err, res);
	  //@ts-ignore
	  if (!user.authenticate(password))
		return failureResponse("Email and Password is not match", {}, res);
	  const token = await jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN, {
		expiresIn: "1d",
	  });
	  const refreshToken = await jwt.sign(
		{ user },
		process.env.JWT_REFRESH_TOKEN,
		{ expiresIn: "7d" }
	  );
	  user.hashed_password = undefined;
	  user.salt = undefined;
	  return res.status(200).json({
		message: "Signin Successful",
		token,
		refreshToken,
		user,
	  });
	});
  };
  public requireSignin = (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization)
	  return res.status(401).json({
		message: "Unauthorized, access denied",
	  });
	const [bearer, token] = req.headers.authorization.split(" ");
	if (!token)
	  return res.status(401).json({
		message: "Unauthorized, access denied",
	  });
	jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
	  if (err)
		return res.status(400).json({
		  message: "token is not valid, access denied",
		});
	  //@ts-ignore
	  req.user = decoded.user;
	  next();
	});
  };
  public isVerified = (req: Request, res: Response, next: NextFunction) => {
	//@ts-ignore
	const isVerified = req.user && req.user.isVerified;
	if (!isVerified)
	  return res.status(400).json({
		message: "Verify required, access denied",
	  });
	next();
  };
  public verifyEmail = (req: Request, res: Response) => {
	const { token } = req.params;
	jwt.verify(token, process.env.JWT_VERIFY_MAIL_TOKEN, (err, decoded) => {
	  if (err)
		return res.status(400).json({
		  message: "token is not valid",
		});
	  const { userId } = decoded;
	  this.userService.verifyUser(userId, (err, user) => {
		if (err) return mongoError(err, res);
		return res.status(200).json({
		  message: "Verify Successful",
		  user,
		});
	  });
	});
  };
  public isAdmin = (req: Request, res: Response, next: NextFunction) => {
	//@ts-ignore
	const isAdmin = req.user.role == 2;
	if (!isAdmin) {
	  return res.status(400).json({
		message: "You are not Admin, access denied"
	  });
	}
	next();
  }
  public isEditor = (req: Request, res: Response, next: NextFunction) => {
	//@ts-ignore
	const isEditor = req.user.role == 1;
	if (isEditor) {
	  return res.status(400).json({
		message: "You are not Editor, access denied"
	  });
	}
	next();
  }
  public refreshToken(req: Request, res: Response) {
	const  {refreshToken}  = req.body;
	if(!refreshToken)
	return insufficientParameters(res);
	  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, decoded) => {
	  if (err) {
		return res.status(400).json({
		  message: "refresh token is not valid",
		});
	  }
	  console.log(decoded);
	  const user = decoded.user;
	  const token =  jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1d' });
	  return res.status(200).json({
		token
	  });
	})
  }
}
