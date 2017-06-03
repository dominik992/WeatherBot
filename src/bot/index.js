import Bot from 'messenger-bot';
import config from './config';
import weatherRepository from '../weather/data/weather-repository';
import _ from 'lodash';

const bot = new Bot({
  token: config.token,
  verify: config.verify,
  app_secret: config.secret,
});

bot.on('error', (err) => {
  console.log(err.message);
});

bot.on('message', (payload, reply) => {
  const text = payload.message.text;
  console.log(text);
  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err;
    weatherRepository.getByCity(text)
      .then(data => {
        const temperature = _.get(data, 'list[0].main.temp');
        const weather = _.get(data, 'list[0].weather[0].description');
        const responseMessage = `Current temperature in ${text} is ${temperature} °C.` +
          `Current weather is: ${weather}.`;
        reply({ text: responseMessage }, (err) => {
          console.log(err);
          if (err) throw err;

          console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
        });
      });
  });
});

export default bot;
