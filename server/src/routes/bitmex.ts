import express from 'express';
import * as bitmexController from '../controllers/bitmexController';
import * as binanceController from '../controllers/binanceController';

const Router = express.Router();

Router.post('/bitmex/*', bitmexController.fetch);
Router.post('/binance/*', bitmexController.fetch);

export default Router;
