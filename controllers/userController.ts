import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IUser } from '../modules/users/model';
import { IToken } from '../modules/tokens/model';
import UserService from '../modules/users/service';
import TokenService from '../modules/tokens/service';
import e = require('express');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")




var crypto = require('crypto');
var nodemailer = require('nodemailer');

export class UserController {

    private user_service: UserService = new UserService();
    private token_service: TokenService = new TokenService();

    public create_user(req: Request, res: Response) {
        // // this check whether all the fields were send through the request or not
        if (req.body.name && req.body.name.first_name && req.body.name.last_name && req.body.email && req.body.phone_number && req.body.gender) {
            const user_params: IUser = {
                name: {
                    first_name: req.body.name.first_name,
                    last_name: req.body.name.last_name
                },
                email: req.body.email,
                password: req.body.password,
                phone_number: req.body.phone_number,
                gender: req.body.gender,
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: null,
                    modification_note: 'New user created'
                }]
            };

            this.user_service.createUser(user_params, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    // Create a verification token for this user
                    const token_params: IToken = ({ _userId: user_data._id, token: crypto.randomBytes(16).toString('hex') });
                    this.token_service.createToken(token_params, (err: any, token_data: IToken) => {
                        if (err) {
                            mongoError(err, res);
                        }
                });

                    console.log("token", token_params.token)
                    var messsage = 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/verify\/' + token_params.token + '.\n'

                    const msg = {
                        to: user_data.email, // Change to your recipient
                        from: 'vagabond2610@gmail.com', // Change to your verified sender
                        subject: 'Confirm Account',
                        text: 'Please confirm your account!!!!',
                        html: '<strong>Click here to verify your account</strong> ' + messsage,

                    }


                    sgMail
                        .send(msg)
                        .then(() => {
                            successResponse('create user and token successfull', user_data, res);

                        })
                        .catch((error) => {
                            console.error(error)
                            console.log(error.response.body.errors)
                        });
                }
            });

        } else {
            // error response if some fields are missing in request body
            insufficientParameters(res);
        }
    }

    public verify_user(req: Request, res: Response) {
        console.log('Verify email!!!', req.params.token);
        // Check for validation errors  
        const token_filter = { token: req.params.token };

        this.token_service.filterToken(token_filter, (err: any, token_data: IToken) => {
            if (err) {
                mongoError(err, res);
            } else {
                const user_filter = { _id: token_data._userId };

                this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
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

    public get_user(req: Request, res: Response) {
        if (req.params.id) {
            const user_filter = { _id: req.params.id };
            this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('get user successfull', user_data, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public update_user(req: Request, res: Response) {
        if (req.params.id &&
            req.body.name || req.body.name.first_name || req.body.name.last_name ||
            req.body.email ||
            req.body.phone_number ||
            req.body.gender) {
            const user_filter = { _id: req.params.id };
            this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else if (user_data) {
                    user_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'User data updated'
                    });
                    const user_params: IUser = {
                        _id: req.params.id,
                        name: req.body.name ? {
                            first_name: req.body.name.first_name ? req.body.name.first_name : user_data.name.first_name,
                            last_name: req.body.name.first_name ? req.body.name.last_name : user_data.name.last_name
                        } : user_data.name,
                        email: req.body.email ? req.body.email : user_data.email,
                        password: req.body.password ? req.body.password : user_data.password,
                        phone_number: req.body.phone_number ? req.body.phone_number : user_data.phone_number,
                        gender: req.body.gender ? req.body.gender : user_data.gender,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : user_data.is_deleted,
                        modification_notes: user_data.modification_notes
                    };
                    this.user_service.updateUser(user_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('update user successfull', null, res);
                        }
                    });
                } else {
                    failureResponse('invalid user', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public delete_user(req: Request, res: Response) {
        if (req.params.id) {
            this.user_service.deleteUser(req.params.id, (err: any, delete_details) => {
                if (err) {
                    mongoError(err, res);
                } else if (delete_details.deletedCount !== 0) {
                    successResponse('delete user successfull', null, res);
                } else {
                    failureResponse('invalid user', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }
}