import mongoose from "mongoose";
import logger from "../utils/logger";

export const connectMongoDB = (url: string) => {
    logger.info(url);
    mongoose
        .connect(url)
        .then(() => {
            logger.info("MongoDB running");
        })
        .catch((err) => {
            logger.info(`MongoDB connection error. Please make sure MongoDB is running. ${err} URL : ${url}`);
        });
};
