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

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password is missing").not().isEmpty().run(req);
    await check("name", "Name is not valid").isLength({ min: 1 }).run(req);
    await check("inviteCode", "Invite code is missing").not().isEmpty().run(req);


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

  


    const invite =  await Invite.findOne({ value: req.body.inviteCode, email: req.body.email });
    const currentDate: Date = new Date();


    if (!invite || invite.isDeleted || invite.isUsed || invite.validUntilDate < currentDate) {
        return res.status(401).json("Invite code is not valid.");
    }
    
   
    const passwordValidationResult: any = passwordSchema.validate(req.body.password, {
        details: true,
    });

    if (passwordValidationResult.length > 0) {
        return res.status(400).json(passwordValidationResult);
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json("Passwords do not match");
    }
    

    const user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        plants: invite.plants,
        adminType: invite.adminType 
    });
    user.plants[0].isActive = true;

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
            invite!.isUsed = true;
            await invite!.save();
            

            req.logIn(user, async (err) => {
                if (err) {
                    return next(err);
                }

               
            return res.json(user);
            });
        });
    });
};

export const logout = async (req: Request, res: Response) => {
    req.session.destroy(() => {
        
        req.logout(function(err) {
            if (err) { return res.sendStatus(500); }
            res.redirect('/');
          });
        return res.sendStatus(204);
    });
};


export const updateUser = async (req: Request, res: Response) => {
    const user: UserDocument = req.user as UserDocument;

    if (!user) {
        return res.status(500).json("User does not exist");
    }

    const { name, email } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;

    

    try {
        await user.save();
        res.json(user);
    } catch (err) {
        return res.status(500).json({ err });
    }
};


export const getUser = (req: Request, res: Response) => {
    const user: UserDocument = req.user as UserDocument;
    return res.json(user);
};
// get user by id
export const getUserById = async (req: Request, res: Response) => {
    await check("id", "id is not valid").isMongoId().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) {
        return res.status(500).json("User does not exist");
    }
    return res.json(user);

};