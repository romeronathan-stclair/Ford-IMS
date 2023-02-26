import express, { Router } from 'express';
import http, { Server as HttpServer } from "http";
import env from './utils/env';
import session, { SessionOptions, CookieOptions } from "express-session";
import expressSession from 'express-session';
import { connectMongoDB } from "./config/mongoose";


const router: Router = express.Router();

const app = express();

connectMongoDB(env.db.fullUrl);

app.use(expressSession);
app.use(`/${env.app.prefix}`, router);

app.get("/health", (req, res) => {
    return res.status(200).json({ status: "UP" });
});
const server: HttpServer =  http.createServer(app);
export default server;
