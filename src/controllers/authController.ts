import { NextFunction, Request, Response, Router } from "express";
import {
  insufficientParameters,
  mongoError,
  successResponse,
  failureResponse,
} from "../modules/common/service";
import { IUser } from "../modules/users/model";
import UserService from "../modules/users/service";
import jwt = require("jsonwebtoken");
import Nodemailer from "../helpers/verifyEmail";
require("dotenv").config();

export class AuthController {
  private userService: UserService = new UserService();
  public mailer: Nodemailer = new Nodemailer();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
      const userEmail = new Promise(async (resolve, reject) => {
        await this.userService.filterUser(
          { email },
          (err: any, user: IUser) => {
            if (err) {
              return reject(err);
            }
            return resolve(user);
          }
        );
      })
        .then((rs) => rs)
        .catch((err) => err);
      const user = await userEmail;
      if (user)
        return res.status(400).json({
          message: "Email already signup",
        });
      const token = await jwt.sign(
        { user: userParams },
        process.env.JWT_VERIFY_MAIL_TOKEN,
        {
          expiresIn: "10m",
        }
      );
      let verifyLink = `http:\/\/${req.headers.host}\/auth\/verify\/${token}`;
      this.mailer.sendMail({
        from: "TOTTI STORE",
        to: email,
        subject: "VERIFY EMAIL",
        html: this.mailer.verifyEmailTemplate(verifyLink),
      });
      return res.status(200).json({
        message: `Signup Successful, Email has been send to ${email}`,
      });
    } catch (error) {
      res.status(500).json({
        message: "Signup Failed",
        error: error.message,
      });
    }
  };

  public signIn = (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!(email && password)) return insufficientParameters(res);
    this.userService.filterUser({ email }, async (err: Error, user: IUser) => {
      if (err) return mongoError(err, res);
      //@ts-ignore
      if (!user.authenticate(password)) {
        return failureResponse("Email and Password is not match", {}, res);
      }
      const token = await jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: "1d",
      });
      const refreshToken = await jwt.sign(
        { user },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: "7d" }
      );
      user.hashed_password = undefined;
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      res.cookie("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
      return res.status(200).json({
        message: "Signin Successful",
        token,
        refreshToken,
        user,
      });
    });
  };

  public isSignIn = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!req.cookies)
      return res.status(401).json({
        message: "Unauthorized, access denied",
      });
    if (!token)
      return res.status(401).json({
        message: "Unauthorized, access denied",
      });
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
      if (err)
        return res.status(400).json({
          message: "Token is not valid, access denied",
        });
      //@ts-ignore
      req.user = decoded.user;
      next();
    });
  };

  public verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.params;
    jwt.verify(
      token,
      process.env.JWT_VERIFY_MAIL_TOKEN,
      (err, decoded: any) => {
        if (err)
          return res.status(400).json({
            message: "token is not valid",
          });
        //@ts-ignore
        const { user } = decoded;
        this.userService.createUser(user, (err, user) => {
          if (err)
            return res.status(400).json({
              message: "Email has been verified",
            });
          user.hashed_password = undefined;
          return res.status(200).json({
            message: "Create user successful",
            user,
          });
        });
      }
    );
  };

  public isAdmin = (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const isAdmin = req.user.role >= 2;
    if (!isAdmin) {
      return res.status(400).json({
        message: "You are not Admin, access denied",
      });
    }
    next();
  };

  public isEditor = (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const isEditor = req.user.role >= 1;
    if (isEditor) {
      return res.status(400).json({
        message: "You are not Editor, access denied",
      });
    }
    next();
  };

  public refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return insufficientParameters(res);
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          message: "refresh token is not valid",
        });
      }
      const user = decoded.user;
      const token = jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      return res.status(200).json({
        message: "refresh token success",
      });
    });
  }
  public async adminLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = this.userService.filterUser({ email }, (err, user) => {
      if (err) return mongoError(err, res);
      if (!user)
        return res.status(400).json({
          message: "Email is not exists",
        });
      if (!user.authenticate(password))
        return res.status(400).json({
          message: "Email and password are not match",
        });
      if (user.role != 2)
        return res.status(400).json({
          message: "Admin required",
        });
      return res.status(200).json({
        message: "Signin successful",
      });
    });
  }
  public signOut(req: Request, res: Response) {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).json({
      message: "Signout success",
    });
  }
}
