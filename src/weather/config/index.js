export default {
  weatherApiEndpoint: process.env.WEATHER_API_ENDPOINT ||
    'http://api.openweathermap.org/',
  weatherApiVersion: process.env.WEATHER_API_VERSION || '2.5',
  weatherApiKey: process.env.WEATHER_API_KEY,
};
