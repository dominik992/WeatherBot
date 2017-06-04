import { assert } from 'chai';
import sinon from 'sinon';
import Promise from 'bluebird';
import proxyquire from 'proxyquire';

sinon.assert.expose(assert, { prefix: '' });

describe.only('Message handler middleware', () => {
  function getMockData() {
    const responseMessage = 'message';
    const payload = {
      message: { text: 'Zagreb' },
    };
    const weather = { city: 'Zagreb' };
    const mockWeatherRepo = {
      getByCity: sinon.stub().returns(Promise.resolve(weather)),
    };
    const mockBuildResponseMessage = sinon.stub().returns(responseMessage);
    const mockLogger = {
      error: sinon.stub(),
    };
    return {
      responseMessage, payload, weather,
      mockWeatherRepo, mockBuildResponseMessage, mockLogger,
    };
  }

  it('Fetches weather for passed city and replies with built message', (done) => {
    const {
      responseMessage, payload, weather, mockWeatherRepo,
      mockBuildResponseMessage,
    } = getMockData();
    const messageHandler = proxyquire.noCallThru().load('../message-handler',
      {
        '../../weather/data/weather-repository': mockWeatherRepo,
        '../services/build-response-message': mockBuildResponseMessage,
      }).default;
    const reply = sinon.stub().callsArgWith(1, null);

    messageHandler()(payload, reply)
      .then(() => {
        assert.calledWith(reply, { text: responseMessage });
        assert.calledWithExactly(mockWeatherRepo.getByCity, payload.message.text);
        assert.calledWithExactly(mockBuildResponseMessage, payload.message.text, weather);
        done();
      }).catch(done);
  });

  it('Logs error from weather repo', (done) => {
    const {
      payload, mockBuildResponseMessage, mockLogger,
    } = getMockData();
    const err = new Error('some error');
    const mockWeatherRepo = {
      getByCity: sinon.stub().returns(Promise.reject(err)),
    };

    const messageHandler = proxyquire.noCallThru().load('../message-handler',
      {
        '../../weather/data/weather-repository': mockWeatherRepo,
        '../services/build-response-message': mockBuildResponseMessage,
        '../../shared/logging/logger': mockLogger,
      }).default;
    messageHandler()(payload)
      .then(() => {
        assert.calledWithExactly(mockWeatherRepo.getByCity, payload.message.text);
        assert.calledWith(mockLogger.error, err);
        done();
      }).catch(done);
  });

  it('Logs error from reply', (done) => {
    const { payload, mockBuildResponseMessage, mockLogger } = getMockData();
    const err = new Error('some error');
    const mockWeatherRepo = {
      getByCity: sinon.stub().returns(Promise.resolve({})),
    };
    const messageHandler = proxyquire.noCallThru().load('../message-handler',
      {
        '../../weather/data/weather-repository': mockWeatherRepo,
        '../services/build-response-message': mockBuildResponseMessage,
        '../../shared/logging/logger': mockLogger,
      }).default;
    const reply = sinon.stub().callsArgWith(1, err);
    messageHandler()(payload, reply)
      .then(() => {
        assert.calledWithExactly(mockWeatherRepo.getByCity, payload.message.text);
        assert.calledWith(mockLogger.error, err);
        done();
      }).catch(done);
  });
});
