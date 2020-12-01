import { NextFunction, Request, Response } from "express";
import {
  insufficientParameters,
  mongoError,
  successResponse,
  failureResponse,
} from "../modules/common/service";
import { IUser } from "../modules/users/model";
import sgMail = require("@sendgrid/mail");
import UserService from "../modules/users/service";
import jwt = require("jsonwebtoken");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export class AuthController {
  private userService: UserService = new UserService();

  public signup = (req: Request, res: Response, next: NextFunction): void => {
    const {
      name: { firstName, lastName },
      email,
      password,
      phoneNumber,
      gender,
    } = req.body;
    if (
      !(firstName || lastName || email || password || phoneNumber || gender)
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
        process.env.JWT_ACCESS_TOKEN,
        {
          expiresIn: "10m",
        },
        function (err, token) {
          if (err) return res.status(400).json({ err });
          const templateId: string = "d-9aa79e9a022b4f2687cb861c2626792a";
          const msg: sgMail.MailDataRequired = {
            to: <string>newUser.email, // Change to your recipient
            from: {
              name: "TOTTI STORE", //The display name
              email: "linhqt1999@gmail.com", //sender
            }, // Change to your verified sender
            subject: "Confirm Account",
            templateId,
            dynamicTemplateData: {
              verifyLink: `http:\/\/${req.headers.host}\/api/verify\/${token}`,
            },
          };
          newUser.hashed_password = undefined;
          sgMail
            .send(msg)
            .then(() => {
              return res.status(200).json({
                message: "Signup Successful",
                newUser,
                token,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    });
  };
}
