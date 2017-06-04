import _ from 'lodash';

export default function buildResponse(receivedMessage, weatherData) {
  const temperature = _.get(weatherData, 'list[0].main.temp');
  const weather = _.get(weatherData, 'list[0].weather[0].description');
  const city = _.get(weatherData, 'city.name');
  let responseMessage = `Current temperature in ${city} is ${temperature} °C.` +
    ` The weather description is: ${weather}.`;
  if (receivedMessage.toLowerCase() !== city.toLowerCase()) {
    responseMessage = `Whoops, we didn't find "${receivedMessage}" city, but we are guessing ` +
      `that you are looking for ${city}. ${responseMessage}`;
  }
  return responseMessage;
}
