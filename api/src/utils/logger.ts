import winston, { LoggerOptions, format, transports } from "winston";
import env from "./env";

const options: LoggerOptions = {
    format: format.combine(
        format.timestamp(),
        format.simple(),
        format.printf((msg) => format.colorize().colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`))
    ),
    transports: [
        new transports.Console({
            level: env.isProd ? "info" : "debug",
        }),
    ],
};
const logger = winston.createLogger(options);

export default logger;
