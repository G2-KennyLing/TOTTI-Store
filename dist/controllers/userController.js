"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const service_1 = require("../modules/common/service");
const service_2 = require("../modules/users/service");
const service_3 = require("../modules/tokens/service");
const schema_1 = require("../modules/users/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");
// sgMail.setApiKey("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");
var crypto = require('crypto');
var nodemailer = require('nodemailer');
class UserController {
    constructor() {
        this.userService = new service_2.default();
        this.tokenService = new service_3.default();
    }
    createUser(req, res) {
        // // this check whether all the fields were send through the request or not
        const saltRounds = 10;
        if (req.body.name && req.body.name.firstName && req.body.name.lastName && req.body.email && req.body.phoneNumber && req.body.gender) {
            const hash = bcrypt.hashSync(req.body.password, saltRounds);
            const userParams = {
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
            this.userService.createUser(userParams, (err, userData) => {
                if (err) {
                    service_1.mongoError(err, res);
                }
                else {
                    // Create a verification token for this user
                    const tokenParams = ({ _userId: userData._id, token: crypto.randomBytes(16).toString('hex') });
                    this.tokenService.createToken(tokenParams, (err, tokenData) => {
                        if (err) {
                            service_1.mongoError(err, res);
                        }
                    });
                    // console.log("token", tokenParams.token)
                    var message = ' Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/verify\/' + tokenParams.token + '.\n';
                    const msg = {
                        to: userData.email,
                        // from: 'quocdatliver@gmail.com', // Change to your verified sender
                        from: 'vagabond2610@gmail.com',
                        subject: 'Confirm Email',
                        text: 'Please confirm your email!!!!',
                        html: '<strong>Please click this email to confirm your email</strong>' + message,
                    };
                    sgMail.send(msg)
                        .then(() => {
                        service_1.successResponse('create user and token successful', userData, res);
                    })
                        .catch((error) => {
                        console.error(error);
                        console.log(error.response.body.errors);
                    });
                }
            });
        }
        else {
            // error response if some fields are missing in request body
            service_1.insufficientParameters(res);
        }
    }
    verifyUser(req, res) {
        console.log('Verify email!!!', req.params.token);
        // Check for validation errors  
        const tokenFilter = { token: req.params.token };
        this.tokenService.filterToken(tokenFilter, (err, tokenData) => {
            if (err) {
                service_1.mongoError(err, res);
            }
            else {
                const userFilter = { _id: tokenData._userId };
                this.userService.filterUser(userFilter, (err, userData) => {
                    if (err) {
                        service_1.mongoError(err, res);
                    }
                    else {
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
    }
    ;
    getUser(req, res) {
        if (req.params.id) {
            const userFilter = { _id: req.params.id };
            this.userService.filterUser(userFilter, (err, userData) => {
                if (err) {
                    service_1.mongoError(err, res);
                }
                else {
                    service_1.successResponse('Get user successful', userData, res);
                }
            });
        }
        else {
            service_1.insufficientParameters(res);
        }
    }
    updateUser(req, res) {
        if (req.params.id &&
            req.body.name || req.body.name.firstName || req.body.name.lastName ||
            req.body.email ||
            req.body.phoneNumber ||
            req.body.gender) {
            const userFilter = { _id: req.params.id };
            this.userService.filterUser(userFilter, (err, userData) => {
                if (err) {
                    service_1.mongoError(err, res);
                }
                else if (userData) {
                    userData.modificationNotes.push({
                        modifiedOn: new Date(Date.now()),
                        modifiedBy: null,
                        modificationNote: 'User data updated'
                    });
                    const userParams = {
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
                    this.userService.updateUser(userParams, (err) => {
                        if (err) {
                            service_1.mongoError(err, res);
                        }
                        else {
                            service_1.successResponse('Update user successful', null, res);
                        }
                    });
                }
                else {
                    service_1.failureResponse('Invalid user', null, res);
                }
            });
        }
        else {
            service_1.insufficientParameters(res);
        }
    }
    deleteUser(req, res) {
        if (req.params.id) {
            this.userService.deleteUser(req.params.id, (err, deleteDetails) => {
                if (err) {
                    service_1.mongoError(err, res);
                }
                else if (deleteDetails.deletedCount !== 0) {
                    service_1.successResponse('Delete user successful', null, res);
                }
                else {
                    service_1.failureResponse('Invalid user', null, res);
                }
            });
        }
        else {
            service_1.insufficientParameters(res);
        }
    }
    loginUser(req, res) {
        const { email, password } = req.body;
        schema_1.default.findOne({ $or: [{ email: email }] })
            .then((User) => {
            if (User) {
                bcrypt.compare(password, User.password, function (err, result) {
                    if (err) {
                        res.json({
                            error: err
                        });
                    }
                    if (result) {
                        let token = jwt.sign({ name: User.name }, 'verySecretValue', { expiresIn: '3h' });
                        res.json({
                            message: 'Login success',
                            token
                        });
                    }
                    else {
                        res.json({
                            message: 'Password not match'
                        });
                    }
                });
            }
            else {
                res.json({
                    message: 'No User found'
                });
            }
        });
    }
}
exports.UserController = UserController;
