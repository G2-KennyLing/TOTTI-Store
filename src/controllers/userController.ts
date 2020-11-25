import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IUser } from '../modules/users/model';
import { IToken } from '../modules/tokens/model';
import UserService from '../modules/users/service';
import TokenService from '../modules/tokens/service';
import User from '../modules/users/schema';
import express = require('express');
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
// sgMail.setApiKey("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");

var crypto = require('crypto');
var nodemailer = require('nodemailer');

export class UserController {

	private userService: UserService = new UserService();
	private tokenService: TokenService = new TokenService();

	public createUser(req: Request, res: Response) {
		// // this check whether all the fields were send through the request or not
		const saltRounds = 10; 
		if (req.body.name && req.body.name.firstName && req.body.name.lastName && req.body.email && req.body.phoneNumber && req.body.gender) {
			const hash = bcrypt.hashSync(req.body.password, saltRounds);
			
			const userParams: IUser = {
				name: {
					firstName: req.body.name.firstName,
					lastName: req.body.name.lastName
				},
				email: req.body.email,
				password: hash,
				phoneNumber: req.body.phoneNumber,
				gender: req.body.gender,
				modificationNotes: [{
					modifiedOn: new Date(Date.now()),
					modifiedBy: null,
					modificationNote: 'New user created'
				}]
			};

			this.userService.createUser(userParams, (err: any, userData: IUser) => {
				if (err) {
					mongoError(err, res);
				} else {
					// Create a verification token for this user
					const tokenParams: IToken = ({ _userId: userData._id, token: crypto.randomBytes(16).toString('hex') });
					this.tokenService.createToken(tokenParams, (err: any, tokenData: IToken) => {
						if (err) {
							mongoError(err, res);
						}
					});
					
					// console.log("token", tokenParams.token)
					var message = ' Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/verify\/' + tokenParams.token + '.\n'

					const msg = {
						to: userData.email, // Change to your recipient
						// from: 'quocdatliver@gmail.com', // Change to your verified sender
						from: 'vagabond2610@gmail.com',
						subject: 'Confirm Email',
						text: 'Please confirm your email!!!!',
						html: '<strong>Please click this email to confirm your email</strong>' + message,
					}
					sgMail.send(msg)
						.then(() => {
							successResponse('create user and token successful', userData, res);
						})
						.catch((error) => {
							console.error(error)
							console.log(error.response.body.errors)
						});
				}
            });
		}  else {
			// error response if some fields are missing in request body
			insufficientParameters(res);
		}
	}

	public verifyUser(req: Request, res: Response) {
		console.log('Verify email!!!', req.params.token);
		// Check for validation errors  
		const tokenFilter = { token: req.params.token };

		this.tokenService.filterToken(tokenFilter, (err: any, tokenData: IToken) => {
			if (err) {
				mongoError(err, res);
			} else {
				const userFilter = { _id: tokenData._userId };

				this.userService.filterUser(userFilter, (err: any, userData: IUser) => {
					if (err) {
						mongoError(err, res);
					} else {

						// Verify and save the user

					}
				});
			}
		});


	//     // Find a matching token
	//     IToken.findOne({ token: req.params.token }, function (err, token) {
	//         if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

	//         // If we found a token, find a matching user
	//         IUser.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
	//             if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
	//             if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

	//             // Verify and save the user
	//             user.isVerified = true;
	//             user.save(function (err) {
	//                 if (err) { return res.status(500).send({ msg: err.message }); }
	//                 res.status(200).send("The account has been verified. Please log in.");
	//             });
	//         });
	//     });

	};

	public getUser(req: Request, res: Response) {
		if (req.params.id) {
			const userFilter = { _id: req.params.id };
			this.userService.filterUser(userFilter, (err: any, userData: IUser) => {
				if (err) {
					mongoError(err, res);
				} else {
					successResponse('Get user successful', userData, res);
				}
			});
		} else {
			insufficientParameters(res);
		}
	}

	public updateUser(req: Request, res: Response) {
		if (req.params.id &&
			req.body.name || req.body.name.firstName || req.body.name.lastName ||
			req.body.email ||
			req.body.phoneNumber ||
			req.body.gender) {
			const userFilter = { _id: req.params.id };
			this.userService.filterUser(userFilter, (err: any, userData: IUser) => {
				if (err) {
					mongoError(err, res);
				} else if (userData) {
					userData.modificationNotes.push({
						modifiedOn: new Date(Date.now()),
						modifiedBy: null,
						modificationNote: 'User data updated'
					});
					const userParams: IUser = {
						_id: req.params.id,
						name: req.body.name ? {
							firstName: req.body.name.firstName ? req.body.name.firstName : userData.name.firstName,
							lastName: req.body.name.firstName ? req.body.name.lastName : userData.name.lastName
						} : userData.name,
						email: req.body.email ? req.body.email : userData.email,
						password: req.body.password ? req.body.password : userData.password,
						phoneNumber: req.body.phoneNumber ? req.body.phoneNumber : userData.phoneNumber,
						gender: req.body.gender ? req.body.gender : userData.gender,
						isDeleted: req.body.isDeleted ? req.body.isDeleted : userData.isDeleted,
						modificationNotes: userData.modificationNotes
					};
					this.userService.updateUser(userParams, (err: any) => {
						if (err) {
							mongoError(err, res);
						} else {
							successResponse('Update user successful', null, res);
						}
					});
				} else {
					failureResponse('Invalid user', null, res);
				}
			});
		} else {
			insufficientParameters(res);
		}
	}

	public deleteUser(req: Request, res: Response) {
		if (req.params.id) {
			this.userService.deleteUser(req.params.id, (err: any, deleteDetails) => {
				if (err) {
					mongoError(err, res);
				} else if (deleteDetails.deletedCount !== 0) {
					successResponse('Delete user successful', null, res);
				} else {
					failureResponse('Invalid user', null, res);
				}
			});
		} else {
			insufficientParameters(res);
		}
	}

	// public loginUser(req: Request, res: Response) {
    //     const { email, password } = req.body;
	// 	User.findOne({$or: [ {email: email} ]})
	// 	.then((User) => {
	// 		if(User) {
	// 			bcrypt.compare(password, User.password, function (err, result) {
	// 				if(err) {
	// 					res.json({
	// 						error: err
	// 					})
	// 				}
	// 				if(result) {
	// 					let token = jwt.sign({ name: User.name }, 'verySecretValue', {expiresIn: '3h'})
	// 					res.json({
	// 						message: 'Login success',
	// 						token
	// 					})
	// 				}else {
	// 					res.json({
	// 						message: 'Password not match'
	// 					})
	// 				}
	// 			})
	// 		}else {
	// 			res.json({
	// 				message: 'No User found'
	// 			})
	// 		}
	// 	})
	// }
}