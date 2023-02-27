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
import * as stockController from "./controllers/stock";
import * as dunnageController from "./controllers/dunnage";

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
router.get("/auth/department/:id", authMiddleware.isAuthenticated, departmentController.getDepartmentById);
router.get("/auth/departments", authMiddleware.isAuthenticated, departmentController.getAllDepartments);
router.get("/auth/departments/user", authMiddleware.isAuthenticated, departmentController.getDepartmentsByUser);
router.put("/auth/department/:id", authMiddleware.isAuthenticated, departmentController.updateDepartment);
router.delete("/auth/department/:id", authMiddleware.isAuthenticated, departmentController.deleteDepartment);

//stock routes
router.post("/auth/stock", authMiddleware.isAuthenticated, stockController.createStock);
router.get("/auth/stock/:id", authMiddleware.isAuthenticated, stockController.getStockById);
router.get("/auth/stocks", authMiddleware.isAuthenticated, stockController.getAllStocks);
router.get("/auth/stocks/department/:id", authMiddleware.isAuthenticated, stockController.getStockByDepartmentId);
router.get("/auth/stocks/name/:name", authMiddleware.isAuthenticated, stockController.getStockByName);
router.get("/auth/stocks/partNumber/:partNumber", authMiddleware.isAuthenticated, stockController.getStockByPartNumber);
router.put("/auth/stock/:id", authMiddleware.isAuthenticated, stockController.updateStock);
router.delete("/auth/stock/:id", authMiddleware.isAuthenticated, stockController.deleteStock);

//dunnage routes
router.post("/auth/dunnage", authMiddleware.isAuthenticated, dunnageController.createDunnage);
router.get("/auth/dunnage/:id", authMiddleware.isAuthenticated, dunnageController.getDunnageById);
router.get("/auth/dunnages", authMiddleware.isAuthenticated, dunnageController.getAllDunnage);
router.get("/auth/dunnages/department/:id", authMiddleware.isAuthenticated, dunnageController.getDunnageByDepartmentId);
router.get("/auth/dunnages/name/:name", authMiddleware.isAuthenticated, dunnageController.getDunnageByName);


const server: HttpServer =  http.createServer(app);
export default server;
