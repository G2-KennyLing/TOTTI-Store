import { Request, Response } from "express";
import {
  insufficientParameters,
  mongoError,
  successResponse,
  failureResponse,
} from "../modules/common/service";
import { IUser } from "../modules/users/model";
import UserService from "../modules/users/service";
import User from "../modules/users/schema";
import express = require("express");
import jwt = require("jsonwebtoken");
import sgMail = require("@sendgrid/mail");

require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export class UserController {
  private userService: UserService = new UserService();

  public forgotPassword(req: Request, res: Response) {
    const {email} = req.body;
    if(!email) 
      return insufficientParameters(res); 
      console.log(this);
    this.userService.filterUser({email}, (err: any, userData: IUser) => {
      if (err) {
        return failureResponse("Email is not valid", userData, res);
      } 
      if (userData) {
        userData.modificationNotes.push({
          modifiedOn: new Date(Date.now()),
          modifiedBy: null,
          modificationNote: "User data updated",
        });
        jwt.sign({user:userData}, process.env.JWT_FORGOTPASSWORD_TOKEN, {expiresIn: '10m'}, function(err, token){
          if (err) return res.status(400).json({ err });
          const templateId: string = "d-72351aceab0c401c958e9713bd97d56e";
          const msg: sgMail.MailDataRequired = {
            to: <string>userData.email, // Change to your recipient
            from: {
              name: "TOTTI STORE", //The display name
              email: "linhqt1999@gmail.com", //sender
            }, // Change to your verified sender
            subject: "Confirm change your Password Account",
            templateId,
            dynamicTemplateData: {
              forgotPasswordLink: `http:\/\/${req.headers.host}\/auth\/resetPassword\/${token}`,
            },
          };
          userData.hashed_password = undefined;
          userData.salt = undefined;
          sgMail
            .send(msg)
            .then(() => {
              return res.status(200).json({
                message: "Send Reset Password Request  Successful",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } )
      }  
       
    });
  }
  public resetPassword(req: Request, res: Response) {
    const {newPasword,token} = req.body;
    jwt.verify(token, process.env.JWT_FORGOTPASSWORD_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          message: "forgot password is not valid",
        });
      }
      const user = decoded.user;
      user.password = newPasword
      this.userService.updateUser(user,(err: Error,userData: IUser) =>{
        if(err){
          return mongoError(err, res);
        }
        return res.status(200).json({
          message: 'change password successful',
          userData
        })
      })
    })
  }
  public getUser(req: Request, res: Response) {
    const  userId =  { _id: req.params.id };
      if (req.params.id) {
        this.userService.filterUser(userId, (err: any, userData: IUser) => {
          if (err) {
            mongoError(err, res);
          }
          if(!userData){
            failureResponse("Not Found ", userData, res);
          } else {
            successResponse("Get user successful", userData, res);
          }
        });
      } else {
        insufficientParameters(res);
      }
    }
    public updateUser(req: Request, res: Response) {
      const { name, email, password, phoneNumber, gender } = req.body;
      const { firstName, lastName } = name || {};
      if (!(firstName && lastName && email && password && phoneNumber && gender)) {
        return insufficientParameters(res);
      }
      else{
          const userFilter = { _id: req.params.id };
          this.userService.filterUser(userFilter, (err: any, userData: IUser) => {
            if (err) {
              return mongoError(err, res);
            }
            if (userData) {
              const userParams: IUser = {
                _id: req.params.id,
                name: name
                  ? {
                      firstName: firstName
                        ? firstName
                        : userData.name.firstName,
                      lastName: lastName
                        ? lastName
                        : userData.name.lastName,
                    }
                  : userData.name,
                email: email ? email : userData.email,
                password: password ? password : userData.password,
                phoneNumber: phoneNumber
                  ? phoneNumber
                  : userData.phoneNumber,
                gender: gender ? gender : userData.gender,
                modificationNotes: [{
                    modifiedOn: new Date(Date.now()),
                    modifiedBy: null,
                    modificationNote: "User data updated",
                }]
              };
              this.userService.updateUser(userParams, (err: any) => {
                if (err) {
                  mongoError(err, res);
                } else {
                  successResponse("Update user successful", userParams, res);
                }
              });
            } else {
              failureResponse("Invalid user", null, res);
            }
          });
        }
  }

  public deleteUser(req: Request, res: Response) {
    const  userId =  { _id: req.params.id };
    if (req.params.id) {
      this.userService.deleteUser(req.params.id, (err: any, deleteDetails) => {
        if (err) {
          mongoError(err, res);
        } else if (deleteDetails.deletedCount !== 0) {
          successResponse("Delete user successful", null, res);
        } else {
          failureResponse("Invalid user", null, res);
        }
      });
    } else {
      insufficientParameters(res);
    }
  }

  // // public loginUser(req: Request, res: Response) {
  // //     const { email, password } = req.body;
  // // 	User.findOne({$or: [ {email: email} ]})
  // // 	.then((User) => {
  // // 		if(User) {
  // // 			bcrypt.compare(password, User.password, function (err, result) {
  // // 				if(err) {
  // // 					res.json({
  // // 						error: err
  // // 					})
  // // 				}
  // // 				if(result) {
  // // 					let token = jwt.sign({ name: User.name }, 'verySecretValue', {expiresIn: '3h'})
  // // 					res.json({
  // // 						message: 'Login success',
  // // 						token
  // // 					})
  // // 				}else {
  // // 					res.json({
  // // 						message: 'Password not match'
  // // 					})
  // // 				}
  // // 			})
  // // 		}else {
  // // 			res.json({
  // // 				message: 'No User found'
  // // 			})
  // // 		}
  // // 	})
  // // }

  

  

  //   public confirmPassword(req: Request, res: Response) {
  //     const userFilter = {
  //       resetPasswordToken: req.params.token,
  //       resetPasswordExpires: { $gt: Date.now() },
  //     };
  //     this.userService.filterUser(userFilter, (err: any, userData: IUser) => {
  //       if (err) {
  //         failureResponse(
  //           "Password reset token is invalid or has expired.",
  //           err,
  //           null
  //         );
  //       } else if (userData) {
  //         userData.modificationNotes.push({
  //           modifiedOn: new Date(Date.now()),
  //           modifiedBy: null,
  //           modificationNote: "User data updated",
  //         });
  //         const userParams: IUser = {
  //           _id: req.params.id,
  //           name: req.body.name
  //             ? {
  //                 firstName: req.body.name.firstName
  //                   ? req.body.name.firstName
  //                   : userData.name.firstName,
  //                 lastName: req.body.name.firstName
  //                   ? req.body.name.lastName
  //                   : userData.name.lastName,
  //               }
  //             : userData.name,
  //           email: req.body.email ? req.body.email : userData.email,
  //           password: req.body.password ? req.body.password : userData.password,
  //           resetPasswordToken: req.body.resetPasswordToken
  //             ? req.body.resetPasswordToken
  //             : userData.resetPasswordToken,
  //           resetPasswordExpires: req.body.resetPasswordExpires
  //             ? req.body.resetPasswordExpires
  //             : userData.resetPasswordExpires,
  //           phoneNumber: req.body.phoneNumber
  //             ? req.body.phoneNumber
  //             : userData.phoneNumber,
  //           gender: req.body.gender ? req.body.gender : userData.gender,
  //           isDeleted: req.body.isDeleted
  //             ? req.body.isDeleted
  //             : userData.isDeleted,
  //           modificationNotes: userData.modificationNotes,
  //         };
  //         this.userService.updateUser(userParams, (err: any) => {
  //           if (err) {
  //             mongoError(err, res);
  //           } else {
  //             successResponse("Change your password successfull", null, res);
  //           }
  //         });
  //       }
  //     });
  //   }
}
