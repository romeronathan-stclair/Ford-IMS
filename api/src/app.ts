import express from 'express';
import http, { Server as HttpServer } from "http";



const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

const server: HttpServer =  http.createServer(app);

export default server;
