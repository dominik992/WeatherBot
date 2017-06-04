import Bot from 'messenger-bot';
import config from './config';
import Promise from 'bluebird';
import messageHandler from './middleware/message-handler';
const bot = new Bot({
  token: config.token,
  verify: config.verify,
  app_secret: config.secret,
});
Promise.promisifyAll(bot);

bot.on('error', (err) => {
  throw err;
});

bot.on('message', messageHandler());

export default bot;
