import server, { redisClient } from "./app";
import env from "./utils/env";
import logger from "./utils/logger";


const port: String = env.app.apiPort;
const nodeEnv: String = env.nodeEnv;

server.listen(port, () => {
    logger.info(`Express server running on port ${port} -- ${nodeEnv}`);
});

redisClient.on("connect", () => {
    logger.info(`Redis server running`);
});
redisClient.on("error", (err: any) => {
    logger.info(`Redis server error: ${err}`);
});

redisClient.connect();

