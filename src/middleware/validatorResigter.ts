import { check, validationResult } from "express-validator";
export default class ValidatorSignup {
  public userSignupValidator = [
    check("name", "Name is required").notEmpty(),
    check("email", "Invalid email").isEmail(),
    check("phoneNumber", "Phone number is required").notEmpty(),
    check("gender", "Gender is required").notEmpty(),
    check("password", "Password is required").notEmpty(),
    check("password")
      .isLength({
        min: 6,
      })
      .withMessage("Password must contain at least 6 characters"),
  ];
  public validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstErr = errors.array()[0].msg;
      console.log(firstErr);
      return res.status(422).json({ error: firstErr });
    }
    next();
  };
}
