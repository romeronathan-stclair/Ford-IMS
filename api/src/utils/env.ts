import dotenv from "dotenv";
import fs from "fs";
import logger from "../utils/logger";

if (fs.existsSync(".env")) {
    dotenv.config({ path: ".env" });
} else {
    dotenv.config({ path: ".env.example" });
}

const getOsEnv = (key: string): string => {
    if (typeof process.env[key] === "undefined") {
        throw new Error(`Environment variable ${key} is not set.`);
    }

    const prodKey = `${key}_PRODUCTION`;

    if (process.env["NODE_ENV"] === "production" && typeof process.env[prodKey] !== "undefined") {
        return process.env[prodKey] as string;
    } else {
        return process.env[key] as string;
    }
};

const env = {
    isProd: getOsEnv("NODE_ENV") === "production",
    isDev: getOsEnv("NODE_ENV") === "development",
    nodeEnv: getOsEnv("NODE_ENV"),
    app: {
        apiPort: getOsEnv("API_PORT"),
        appName: getOsEnv("API_NAME"),
        sessionSecret: getOsEnv("SESSION_SECRET"),
        prefix: getOsEnv("API_PREFIX"),
        apiUrl: getOsEnv("API_URL")
    },
    db: {
        dbUser: getOsEnv("DB_USERNAME"),
        dbUserPassword: getOsEnv("DB_PASSWORD"),
        urlPrefix: getOsEnv("DB_URL_PREFIX"),
        url: getOsEnv("DB_URL"),
        fullUrl: `${getOsEnv("DB_URL_PREFIX")}${getOsEnv("DB_URL")}`,
    },
    mailer: {
        service: getOsEnv("MAILER_SERVICE"),
        username: getOsEnv("MAILER_USERNAME"),
        password: getOsEnv("MAILER_PASSWORD"),
        senderEmail: getOsEnv("MAILER_SENDER_EMAIL"),
    },
    client: {
        url: getOsEnv("CLIENT_URL"),
    },
    aws: {
        redisUrl: getOsEnv("REDIS_URL")
    },
};

export default env;
