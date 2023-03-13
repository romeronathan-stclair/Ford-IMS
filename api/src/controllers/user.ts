import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import passport from "passport";
import { User, UserDocument, Invite } from "../models";
import passwordSchema from "../utils/passwordValidator";
import bcrypt from "bcrypt";
import { ModelType } from "../enums/modelType";
import { ImageRequest } from "../type/imageRequest";
import env from "../utils/env";
import { getPage, getPageSize } from "../utils/pagination";

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




    const invite = await Invite.findOne({ value: req.body.inviteCode, email: req.body.email });
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

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy(function (err) {
        res.redirect('/');
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
export const changePassword = async (req: Request, res: Response) => {
    await check("oldPassword", "Old password cannot be blank").isLength({ min: 1 }).run(req);
    await check("password", "New password cannot be blank").isLength({ min: 1 }).run(req);
    await check("confirmPassword", "New passwords do not match").isLength({ min: 1 }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    const oldPassword: string = req.body.oldPassword;
    const user: UserDocument = req.user as UserDocument;

    if (!user) {
        return res.status(400).json("User does not exist");
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json("New passwords do not match");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
        return res.status(400).json("Old password is incorrect");
    }

    const passwordValidationResult: any = passwordSchema.validate(req.body.password, {
        details: true,
    });

    if (passwordValidationResult.length > 0) {
        return res.status(400).json(passwordValidationResult);
    }

    const newAndOldPasswordsMatch = await bcrypt.compare(req.body.password, user.password);

    if (newAndOldPasswordsMatch) {
        return res.status(400).json("New password is same as old password");
    }

    user.password = req.body.password;

    try {
        await user.save();
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ err });
    }
};


export const getUser = (req: Request, res: Response) => {
    const user: UserDocument = req.user as UserDocument;

    const activePlantId = user.plants.find((plant) => plant.isActive)?.plantId || '0';









    return res.json({ user: user, activePlantId: activePlantId });
};

export const changeActivePlant = async (req: Request, res: Response) => {
    await check("plantId", "plantId is not valid").isMongoId().run(req);
    const errors = validationResult(req);
    const plantId = req.body.plantId;
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    const user: UserDocument = req.user as UserDocument;
    if (!user) {
        return res.status(500).json("User does not exist");
    }
    const plant = user.plants.find((plant) => plant.plantId === plantId);
    if (!plant) {
        return res.status(500).json("Plant does not exist");
    }
    user.plants.forEach((plant) => {
        if (plant.plantId != plantId) plant.isActive = false;
        else plant.isActive = true;
    });

    try {
        await user.save();
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ err });
    }
};


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
export const getUsers = async (req: Request, res: Response) => {
    const page = getPage(req);
    const pageSize = getPageSize(req);
    const userId = req.query.userId;
    const plantId = req.query.plantId;
    const departmentId = req.query.departmentId;
    const name = req.query.name;
    const email = req.query.email;



    let query: any = { isDeleted: false };

    if (userId) {
        const user = await User.findOne({ _id: userId, isDeleted: false });
        if (!user) {
            return res.status(500).json("User does not exist");
        }
        return res.status(200).json(user);
    }

    if (plantId && departmentId) {
        query["plants"] = {
            $elemMatch: {
                plantId: plantId,
                departments: departmentId
            }
        };
    } else if (plantId) {
        query["plants"] = {
            $elemMatch: {
                plantId: plantId
            }
        };
    }

    if (name) {
        query["name"] = { $regex: name, $options: "i" };
    }

    if (email) {
        query["email"] = { $regex: email, $options: "i" };
    }



    const userCount = await User.countDocuments(query);
    const users = await User.find(query).skip(page * pageSize).limit(pageSize).exec();

    let response = {
        users: users,
        userCount: userCount,
    };



    return res.status(200).json(response);
}
