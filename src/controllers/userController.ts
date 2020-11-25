import { Request, Response } from "express";
import {
  insufficientParameters,
  mongoError,
  successResponse,
  failureResponse,
} from "../modules/common/service";
import { IUser } from "../modules/users/model";
import { IToken } from "../modules/tokens/model";
import UserService from "../modules/users/service";
import TokenService from "../modules/tokens/service";
import schema from "../modules/users/schema";
import express = require("express");
import bcrypt = require("bcrypt");

const sgMail = require("@sendgrid/mail");
const key =
  "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";
// sgMail.setApiKey("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")
sgMail.setApiKey(key);
var crypto = require("crypto");
var nodemailer = require("nodemailer");

export class UserController {
  private userService: UserService = new UserService();
  private tokenService: TokenService = new TokenService();

  public createUser(req: Request, res: Response) {
    // // this check whether all the fields were send through the request or not
    if (
      req.body.name &&
      req.body.name.firstName &&
      req.body.name.lastName &&
      req.body.email &&
      req.body.phoneNumber &&
      req.body.gender
    ) {
      const userParams: IUser = {
        name: {
          firstName: req.body.name.firstName,
          lastName: req.body.name.lastName,
        },
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        modificationNotes: [
          {
            modifiedOn: new Date(Date.now()),
            modifiedBy: null,
            modificationNote: "New user created",
          },
        ],
      };

      this.userService.createUser(userParams, (err: any, userData: IUser) => {
        if (err) {
          mongoError(err, res);
        } else {
          // Create a verification token for this user
          const tokenParams: IToken = {
            _userId: userData._id,
            token: crypto.randomBytes(16).toString("hex"),
          };
          this.tokenService.createToken(
            tokenParams,
            (err: any, tokenData: IToken) => {
              if (err) {
                mongoError(err, res);
              }
            }
          );
          const template_id = "d-9aa79e9a022b4f2687cb861c2626792a";
          const msg = {
            to: userData.email, // Change to your recipient
            from: {
              name: "TOTTI STORE", //The display name
              email: "linhqt1999@gmail.com", //sender
            }, // Change to your verified sender
            subject: "Confirm Account",
            template_id,
            dynamic_template_data: {
              verifyLink: `http:\/\/${req.headers.host}\/api/verify\/${tokenParams.token}`,
            },
          };
          sgMail
            .send(msg)
            .then(() => {
              successResponse(
                "create user and token successfull",
                userData,
                res
              );
            })
            .catch((error) => {
              console.error(error);
              console.log(error.response.body.errors);
            });
        }
      });
    } else {
      // error response if some fields are missing in request body
      insufficientParameters(res);
    }
  }

  public verifyUser(req: Request, res: Response) {
    console.log("Verify email!!!", req.params.token);
    // Check for validation errors
    const tokenFilter = { token: req.params.token };

    this.tokenService.filterToken(
      tokenFilter,
      (err: any, tokenData: IToken) => {
        if (err) {
          mongoError(err, res);
        } else {
          const userFilter = { _id: tokenData._userId };

          this.userService.filterUser(
            userFilter,
            (err: any, userData: IUser) => {
              if (err) {
                mongoError(err, res);
              } else {
                // Verify and save the user
              }
            }
          );
        }
      }
    );

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

  public getUser(req: Request, res: Response) {
    if (req.params.id) {
      const userFilter = { _id: req.params.id };
      this.userService.filterUser(userFilter, (err: any, userData: IUser) => {
        if (err) {
          mongoError(err, res);
        } else {
          successResponse("Get user successfull", userData, res);
        }
      });
    } else {
      insufficientParameters(res);
    }
  }

  public updateUser(req: Request, res: Response) {
    if (
      (req.params.id && req.body.name) ||
      req.body.name.firstName ||
      req.body.name.lastName ||
      req.body.email ||
      req.body.phoneNumber ||
      req.body.gender
    ) {
      const userFilter = { _id: req.params.id };
      this.userService.filterUser(userFilter, (err: any, userData: IUser) => {
        if (err) {
          mongoError(err, res);
        } else if (userData) {
          userData.modificationNotes.push({
            modifiedOn: new Date(Date.now()),
            modifiedBy: null,
            modificationNote: "User data updated",
          });
          const userParams: IUser = {
            _id: req.params.id,
            name: req.body.name
              ? {
                  firstName: req.body.name.firstName
                    ? req.body.name.firstName
                    : userData.name.firstName,
                  lastName: req.body.name.firstName
                    ? req.body.name.lastName
                    : userData.name.lastName,
                }
              : userData.name,
            email: req.body.email ? req.body.email : userData.email,
            password: req.body.password ? req.body.password : userData.password,
            phoneNumber: req.body.phoneNumber
              ? req.body.phoneNumber
              : userData.phoneNumber,
            gender: req.body.gender ? req.body.gender : userData.gender,
            isDeleted: req.body.isDeleted
              ? req.body.isDeleted
              : userData.isDeleted,
            modificationNotes: userData.modificationNotes,
          };
          this.userService.updateUser(userParams, (err: any) => {
            if (err) {
              mongoError(err, res);
            } else {
              successResponse("Update user successfull", null, res);
            }
          });
        } else {
          failureResponse("Invalid user", null, res);
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
          successResponse("Delete user successfull", null, res);
        } else {
          failureResponse("Invalid user", null, res);
        }
      });
    } else {
      insufficientParameters(res);
    }
  }

  // public loginUser(req: Request, res: Response) {
  //     const { email, password } = req.body;
  //     schema.findOne({
  //         email: email,
  //         password: password
  //     })
  //     .then(data=>{
  //         if(data){
  //             res.status(200).json('Login success');
  //         }else{
  //             res.status(300).json('Login fail, error at server');
  //         }
  //     })
  // }
}
