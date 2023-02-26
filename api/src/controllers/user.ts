import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import passport from "passport";
import { User, UserDocument, Invite } from "../models";
import passwordSchema from "../utils/passwordValidator";
export const signin = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.sendStatus(400);
    }

    passport.authenticate("local", (err: Error, user: UserDocument) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.sendStatus(401);
        }
        if (user.deactivatedDate) {
            return res.status(401).json("Account has been deactivated");
        }

        req.login(user, async (err) => {
            if (err) {
                return next(err);
            }

            return res.json(user);
        });
    })(req, res, next);
};

export const signupUnsafe = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password is missing").not().isEmpty().run(req);
    await check("name", "Name is not valid").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    const passwordValidationResult: any = passwordSchema.validate(req.body.password, {
        details: true,
    });

    if (passwordValidationResult.length > 0) {
        return res.status(400).json(passwordValidationResult);
    }
  
    const user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        plants: req.body.plants,
        role: req.body.role,
    });

    User.findOne({ email: req.body.email }, (err: NativeError, existingUser: UserDocument) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.status(500).json({ error: "User already exists!" });
        }
        user.save(async (err) => {
            if (err) {
                return next(err);
            }
            req.logIn(user, async (err) => {
                if (err) {
                    return next(err);
                }


                return res.json(user);
            });
        });
    });
};







