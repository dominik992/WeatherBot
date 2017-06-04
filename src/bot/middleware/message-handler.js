import weatherRepository from '../../weather/data/weather-repository';
import buildResponseMessage from '../services/build-response-message';
import logger from '../../shared/logging/logger';

export default function handleMessage() {
  return (payload, reply) => {
    const text = payload.message.text;
    return weatherRepository.getByCity(text)
      .then(data => {
        reply({ text: buildResponseMessage(text, data) },
          (err) => {
            if (err) { logger.error(err); }
          });
      }).catch(logger.error);
  };
}
