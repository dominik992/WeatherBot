import weatherRepository from '../../weather/data/weather-repository';
import buildResponseMessage from '../services/build-response-message';

export default function handleMessage() {
  return (payload, reply) => {
    const text = payload.message.text;
    weatherRepository.getByCity(text)
      .then(data => {
        reply({ text: buildResponseMessage(text, data) }, (err) => {
          if (err) throw err;
        });
      });
  };
}
