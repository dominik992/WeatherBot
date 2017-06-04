import Bot from 'messenger-bot';
import config from './config';
import messageHandler from './middleware/message-handler';
import logger from '../shared/logging/logger';

const bot = new Bot({
  token: config.token,
  verify: config.verify,
  app_secret: config.secret,
});

bot.on('error', (err) => {
  logger.error(err);
});

bot.on('message', messageHandler());

export default bot;
