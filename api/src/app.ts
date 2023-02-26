import express, { RequestHandler, Router } from 'express';
import http, { Server as HttpServer } from "http";
import env from './utils/env';
import session, { SessionOptions, CookieOptions } from "express-session";
import { connectMongoDB } from "./config/mongoose";
import MongoStore from "connect-mongo";
import passport from 'passport';
import { configPassport } from './config/passport';

import * as userController from "./controllers/user";

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
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());

app.use(`/${env.app.prefix}`, router);

app.get("/health", (req, res) => {
    return res.status(200).json({ status: "UP" });
});


router.post("/auth/signup/dev", userController.signupUnsafe);

const server: HttpServer =  http.createServer(app);
export default server;
