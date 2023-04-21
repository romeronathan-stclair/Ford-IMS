import env from "../utils/env";
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { UserDocument } from "../models";
import { Roles } from "../enums/roles";


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
    if (!req.isAuthenticated() || user.role != Roles.Admin) {
        return res.status(401).json("Admin user not authenticated!");
    }

    return next();
};
export const isPlantManagerAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const user: UserDocument = req.user as UserDocument;
    if (!req.isAuthenticated() || (user.role !== Roles.PlantManager && user.role !== Roles.Admin)) {
        return res.status(401).json("Plant Manager user not authenticated!");
    }

    return next();
}
export const canEditUsers = (req: Request, res: Response, next: NextFunction) => {
    const user: UserDocument = req.user as UserDocument;
    if (!req.isAuthenticated() || (user.role === Roles.Employee || user.role === Roles.CycleChecker)) {
        return res.status(401).json("User not authorized to edit other users!");
    }

    return next();
}
export const startProductionCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user: UserDocument = req.user as UserDocument;
    if (!req.isAuthenticated() ||
        (user.role !== Roles.Admin &&
            user.role !== Roles.PlantManager &&
            user.role !== Roles.TeamManager &&
            user.role !== Roles.SeniorProcessCoach &&
            user.role !== Roles.ProcessCoach)) {
        return res.status(401).json("User not authorized to start production count!");
    }

    return next();
}

export const startCycleCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user: UserDocument = req.user as UserDocument;
    if (!req.isAuthenticated() ||
        (user.role !== Roles.Admin &&
            user.role !== Roles.PlantManager &&
            user.role !== Roles.TeamManager &&
            user.role !== Roles.SeniorProcessCoach)) {
        return res.status(401).json("User not authorized to start cycle check!");
    }

    return next();
}

export const startSubAssemblyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user: UserDocument = req.user as UserDocument;
    if (!req.isAuthenticated() ||
        (user.role !== Roles.Admin &&
            user.role !== Roles.PlantManager &&
            user.role !== Roles.TeamManager &&
            user.role !== Roles.SeniorProcessCoach &&
            user.role !== Roles.ProcessCoach)) {
        return res.status(401).json("User not authorized to start sub-assembly!");
    }

    return next();
}
export const deleteDepartmentMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user: UserDocument = req.user as UserDocument;
    if (!req.isAuthenticated() ||
        (user.role !== Roles.Admin &&
            user.role !== Roles.PlantManager &&
            user.role !== Roles.TeamManager)) {
        return res.status(401).json("User not authorized to delete departments!");
    }

    return next();
}
export const editDepartmentMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user: UserDocument = req.user as UserDocument;
    if (!req.isAuthenticated() ||
        (user.role !== Roles.Admin &&
            user.role !== Roles.PlantManager &&
            user.role !== Roles.TeamManager &&
            user.role !== Roles.SeniorProcessCoach)) {
        return res.status(401).json("User not authorized to edit departments!");
    }

    return next();
}

