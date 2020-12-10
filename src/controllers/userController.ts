import { Request, Response } from "express";
import {
  insufficientParameters,
  mongoError,
  successResponse,
  failureResponse,
} from "../modules/common/service";
import { IUser } from "../modules/users/model";
import UserService from "../modules/users/service";
import express = require("express");
import jwt = require("jsonwebtoken");
import sgMail = require("@sendgrid/mail");
import { resolve } from "path";
import Nodemailer from "../helpers/sendgird";

require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class UserController {
  private userService: UserService = new UserService();
  private mailer: Nodemailer = new Nodemailer();
  public async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return insufficientParameters(res);
      const handleFilter = new Promise((resolve, reject) => {
        this.userService.filterUser({ email }, (err: any, userData: IUser) => {
          if (err) {
            return reject(err);
          }
          userData.modificationNotes.push({
            modifiedOn: new Date(Date.now()),
            modifiedBy: null,
            modificationNote: "User data updated",
          });
          return resolve(userData);
        });
      })
        .then((rs) => rs)
        .catch((err) => err);
      const userData = await handleFilter;
      const token = await jwt.sign(
        { user: userData },
        process.env.JWT_FORGOTPASSWORD_TOKEN,
        { expiresIn: "10m" }
      );
      const forgotLink = `http:\/\/${req.headers.host}\/auth\/forgotPassword\/${token}`;
      const sendMail = this.mailer.sendMail({
        from: "TOTTI STORE",
        to: email,
        subject: "FORGOT PASSWORD",
        html: this.mailer.forgotPasswordTemplate(forgotLink),
      });
      return res.status(200).json({
        message: "The request has been resolved",
        data: sendMail,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to send request",
        error: error.message,
      });
    }
  }
  public resetPassword(req: Request, res: Response) {
    const { newPasword, token } = req.body;
    jwt.verify(token, process.env.JWT_FORGOTPASSWORD_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          message: "forgot password token is not valid",
        });
      }
      const user = decoded.user;
      user.password = newPasword;
      this.userService.updateUser(user, (err: Error, userData: IUser) => {
        if (err) {
          return mongoError(err, res);
        }
        return res.status(200).json({
          message: "change password successful",
          userData,
        });
      });
    });
  }
  public getUser(req: Request, res: Response) {
    const userId = { _id: req.params.id };
    if (req.params.id) {
      this.userService.filterUser(userId, (err: any, userData: IUser) => {
        if (err) {
          mongoError(err, res);
        }
        if (!userData) {
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
    if (
      !(firstName && lastName && email && password && phoneNumber && gender)
    ) {
      return insufficientParameters(res);
    } else {
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
                  firstName: firstName ? firstName : userData.name.firstName,
                  lastName: lastName ? lastName : userData.name.lastName,
                }
              : userData.name,
            email: email ? email : userData.email,
            password: password ? password : userData.password,
            phoneNumber: phoneNumber ? phoneNumber : userData.phoneNumber,
            gender: gender ? gender : userData.gender,
            modificationNotes: [
              {
                modifiedOn: new Date(Date.now()),
                modifiedBy: null,
                modificationNote: "User data updated",
              },
            ],
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
    const userId = { _id: req.params.id };
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
}
