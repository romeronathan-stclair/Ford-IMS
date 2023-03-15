import env from "../utils/env";
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { UserDocument } from "../models";

export const isDevelopmentEnvironment = (req: Request, res: Response, next: NextFunction) => {
    if (!env.isDev) {
        return res.status(401).json("Not authorized on production!");
    }

    return next();
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json("User not authenticated!");
    }
    return next();
};

export const isAdminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const user: UserDocument = req.user as UserDocument;
    if (!req.isAuthenticated()) {
        return res.status(401).json("Admin user not authenticated!");
    }

    return next();
};
