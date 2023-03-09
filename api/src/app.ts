import express, { RequestHandler, Router } from 'express';
import http, { Server as HttpServer } from "http";
import env from './utils/env';
import session, { SessionOptions, CookieOptions } from "express-session";
import { connectMongoDB } from "./config/mongoose";
import MongoStore from "connect-mongo";
import passport from 'passport';
import fileUpload from 'express-fileupload';
import { configPassport } from './config/passport';

import cors, { CorsOptions } from "cors";
import * as authMiddleware from "./middleware/auth.middleware";
import * as userController from "./controllers/user";
import * as eventController from "./controllers/event"
import * as departmentController from "./controllers/department";
import * as plantController from "./controllers/plant";
import * as stockController from "./controllers/stock";
import * as dunnageController from "./controllers/dunnage";
import * as inviteController from "./controllers/invite";
import * as imageController from "./controllers/image";
import * as productController from "./controllers/product";
import * as productDunnageController from "./controllers/productDunnage";
import * as productStockController from "./controllers/productStock";
import * as forecastController from "./controllers/forecast";
import * as cycleCheckController from "./controllers/cycleCheck";
import * as productionCountController from "./controllers/productionCount";
import * as redis from "redis";

import bodyParser from 'body-parser';



export const redisClient: redis.RedisClientType = redis.createClient({
    legacyMode: true,

    socket: {
        port: 6379,
        host: env.aws.redisUrl,
        connectTimeout: 10000,

    },
});

const router: Router = express.Router();

const app = express();

const cookieOptions: CookieOptions = {
    maxAge: 1000 * 60 * 10,
    sameSite: env.isProd ? "none" : "lax",
    secure: env.isProd ? true : false,
    domain: env.isProd ? env.client.url : undefined,
    path: "/",
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
const corsOptions: CorsOptions = {
    origin: env.client.url,
    credentials: true,
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials",
        "Cache-Control",
    ],
};



const expressSession: RequestHandler = session(sessionOptions);
connectMongoDB(env.db.fullUrl);
configPassport();
app.use(express.json());
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(`/${env.app.prefix}`, router);

app.get("/health", (req, res) => {
    return res.status(200).json({ status: "UP" });
});

//user routes
router.post("/auth/signup/dev", userController.signupUnsafe);
router.post("/auth/signin", userController.signin);
router.get("/auth/signout", userController.logout);
router.post("/auth/update", authMiddleware.isAuthenticated, userController.updateUser);
router.get("/auth/user", authMiddleware.isAuthenticated, userController.getUser);
router.get("/auth/users", authMiddleware.isAuthenticated, userController.getUsers);
router.get("/auth/user/:id", authMiddleware.isAdminAuthenticated, userController.getUserById);
router.post("/auth/reset", authMiddleware.isAuthenticated, userController.changePassword);
router.put("/auth/user/active-plant", authMiddleware.isAuthenticated, userController.changeActivePlant);
//invite routes
router.post("/invite", authMiddleware.isAuthenticated, inviteController.sendInvite);
//event routes
router.get("/event", authMiddleware.isAdminAuthenticated, eventController.getEvents);

// image routes
router.post("/image", imageController.imageUpload);
router.get("/public/images/:plantId/:departmentId/:modelType/:item", imageController.retrieveImage);
//plant routes
router.post("/plant", authMiddleware.isAuthenticated, plantController.createPlant);
router.get("/plant", authMiddleware.isAuthenticated, plantController.getActivePlant);
router.get("/plants", authMiddleware.isAuthenticated, plantController.getPlants);
router.put("/plant", authMiddleware.isAuthenticated, plantController.updatePlant);
router.delete("/plant/:id", authMiddleware.isAuthenticated, plantController.deletePlant);

//department routes
router.post("/auth/department", authMiddleware.isAuthenticated, departmentController.createDepartment);
router.get("/auth/departments", authMiddleware.isAuthenticated, departmentController.getDepartments);
router.put("/auth/department/:id", authMiddleware.isAuthenticated, departmentController.updateDepartment);
router.delete("/auth/department/:id", authMiddleware.isAuthenticated, departmentController.deleteDepartment);

//product routes
router.post("/auth/product", authMiddleware.isAuthenticated, productController.createProduct);
router.get("/auth/product", authMiddleware.isAuthenticated, productController.getProduct);
router.put("/auth/product/:id", authMiddleware.isAuthenticated, productController.updateProduct);
router.delete("/auth/product/:id", authMiddleware.isAuthenticated, productController.deleteProduct);

//stock routes
router.post("/auth/stock", stockController.createStock);
router.get("/auth/stock", authMiddleware.isAuthenticated, stockController.getStock);
router.put("/auth/stock/:id", authMiddleware.isAuthenticated, stockController.updateStock);
router.delete("/auth/stock/:id", authMiddleware.isAuthenticated, stockController.deleteStock);

//dunnage routes
router.post("/auth/dunnage", authMiddleware.isAuthenticated, dunnageController.createDunnage);
router.get("/auth/dunnage", authMiddleware.isAuthenticated, dunnageController.getDunnage);
router.put("/auth/dunnage/:id", authMiddleware.isAuthenticated, dunnageController.updateDunnage);
router.delete("/auth/dunnage/:id", authMiddleware.isAuthenticated, dunnageController.deleteDunnage);

// product dunnage routes
router.post("/auth/product-dunnage", authMiddleware.isAuthenticated, productDunnageController.createProductDunnage);
router.delete("/auth/product-dunnage/:id", authMiddleware.isAuthenticated, productDunnageController.deleteProductDunnage);

// product stock routes
router.post("/auth/product-stock", authMiddleware.isAuthenticated, productStockController.createProductStock);
router.delete("/auth/product-stock/:id", authMiddleware.isAuthenticated, productStockController.deleteProductStock);
router.put("/auth/product-stock", authMiddleware.isAuthenticated, productStockController.changeUserPerProduct);


// forecast routes
router.get("/auth/forecast/:id", authMiddleware.isAuthenticated, forecastController.getForecastProduct);
router.get("/auth/forecast/department/low/:id", authMiddleware.isAuthenticated, forecastController.departmentLowForecasts);
router.get("/auth/forecast", authMiddleware.isAuthenticated, forecastController.forecastAll);
router.get("/auth/forecast/plant/low", authMiddleware.isAuthenticated, forecastController.getPlantLowForecasts);
router.get("/auth/forecast/department/:id", authMiddleware.isAuthenticated, forecastController.getDepartmentForecasts);

// cycle check routes
router.get("/auth/cycle-check", authMiddleware.isAuthenticated, cycleCheckController.getCycleCheck);
router.put("/auth/cycle-check", authMiddleware.isAuthenticated, cycleCheckController.submitCycleCheck);

// production count routes
router.post("/auth/production-count", authMiddleware.isAuthenticated, productionCountController.submitProductionCount);

const server: HttpServer = http.createServer(app);
export default server;
