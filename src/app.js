import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Logger } from './shared/logging/logger';
import loggingConfig from './shared/logging/config/logging';
import bot from './bot';
const isProd = process.env.NODE_ENV === 'production';
const loggerOptions = {
  src: !isProd,
  stdout: !isProd,
};

const logger = new Logger(loggingConfig, isProd);
const app = express();
app.disable('x-powered-by');

app.use(cors());
app.options('*', cors());

app.use(logger.requestLogger(loggerOptions));

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(express.static(`${__dirname}/public`));

app.use(bot.middleware());

app.use((err, req, res, next) => {
  req.logger.error({ err, req });
  next(err);
});

export default app;
