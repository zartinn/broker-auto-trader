/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Express } from 'express';
import express from 'express';
import cors from 'cors';
import { defineLogin } from './app/endpoints/login';
import { defineLogout } from './app/endpoints/logout';
import { defineStock } from './app/endpoints/stock';
import { defineCreateOrder } from './app/endpoints/createOrder';

const app = express();

addMiddleWares(app);
defineEndpoints(app);
startServer(app);

function addMiddleWares(app: Express) {
  app.use(express.json());
  app.use(cors());
}

function defineEndpoints(app: Express) {
  defineLogin(app);
  defineLogout(app);
  defineStock(app);
  defineCreateOrder(app);
}

function startServer(app: Express) {
  const port = process.env.port || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
  server.on('error', console.error);
}