import request from 'request-promise';
import URI from 'urijs';
import config from '../config';

export class WeatherRepository {
  getByCity(city) {
    const uri = new URI(config.weatherApiEndpoint)
      .segment(`/data/${config.weatherApiVersion}/forecast`)
      .query({ q: city, appid: config.weatherApiKey, units: 'metric' })
      .toString();
    return request({
      json: true,
      method: 'GET',
      uri,
    });
  }
}

export default new WeatherRepository();
