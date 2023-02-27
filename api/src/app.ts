import express, { RequestHandler, Router } from 'express';
import http, { Server as HttpServer } from "http";
import env from './utils/env';
import session, { SessionOptions, CookieOptions } from "express-session";
import { connectMongoDB } from "./config/mongoose";
import MongoStore from "connect-mongo";
import passport from 'passport';
import { configPassport } from './config/passport';

import * as authMiddleware from "./middleware/auth.middleware";
import * as userController from "./controllers/user";
import * as departmentController from "./controllers/department";

import * as inviteController from "./controllers/invite";
const router: Router = express.Router();

const app = express();

const cookieOptions: CookieOptions = {
    maxAge: 1000 * 60 * 10,
    sameSite: env.isProd ? "none" : "lax",
    secure: env.isProd ? true : false,
};

const sessionOptions: SessionOptions = {
    secret: env.app.sessionSecret,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: env.db.fullUrl,

    }),
    cookie: cookieOptions,

};
const expressSession: RequestHandler = session(sessionOptions);
connectMongoDB(env.db.fullUrl);
configPassport();
app.use(express.json());
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());

app.use(`/${env.app.prefix}`, router);

app.get("/health", (req, res) => {
    return res.status(200).json({ status: "UP" });
});

//user routes
router.post("/auth/signup/dev", userController.signupUnsafe);
router.post("/auth/signin", userController.signin);
router.post("/auth/signout", userController.logout);
router.post("/auth/update", authMiddleware.isAuthenticated, userController.updateUser);
router.get("/auth/user", authMiddleware.isAuthenticated, userController.getUser);
router.get("/auth/user/:id", authMiddleware.isAdminAuthenticated, userController.getUserById);

//invite routes
router.post("/invite", authMiddleware.isAdminAuthenticated, inviteController.sendInvite);

//plant routes



//department routes
router.post("/auth/department", authMiddleware.isAuthenticated, departmentController.createDepartment);
router.get("/auth/department/:departmentId", authMiddleware.isAuthenticated, departmentController.getDepartmentById);
router.get("/auth/departments", authMiddleware.isAuthenticated, departmentController.getAllDepartments);
router.get("/auth/departments/user", authMiddleware.isAuthenticated, departmentController.getDepartmentsByUser);
router.put("/auth/department/:departmentId", authMiddleware.isAuthenticated, departmentController.updateDepartment);
router.delete("/auth/department/:departmentId", authMiddleware.isAuthenticated, departmentController.deleteDepartment);


const server: HttpServer =  http.createServer(app);
export default server;
