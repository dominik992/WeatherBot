import { assert } from 'chai';
import * as _ from 'lodash';
import sinon from 'sinon';
import { Logger } from '../logger';
import path from 'path';
import logger from '../logger'; // eslint-disable-line no-duplicate-imports

sinon.assert.expose(assert, { prefix: '' });

const defaultLogOptions = {
  logLevel: 'info',
  logDir: '/var/tmp',
};

describe('Logger', () => {
  it('should create a logger with options without error', () => {
    const logger = new Logger(defaultLogOptions, false);
    assert.isOk(logger);
    assert.isFunction(logger.requestLogger);
  });

  it('should throw error if invalid log level supplied', () => {
    assert.throws(() => new Logger({ logLevel: 'pile' }), Error);
  });

  it('should throw error if no logDir passed in for prod configuration', () => {
    assert.throws(() => new Logger({ logLevel: 'error', logDir: '' }, true), Error);
  });

  it('should default logDir to logs folder if not specified and not prod', (done) => {
    const logger = new Logger({ logLevel: 'info', logDir: '' }, false);
    assert.isOk(logger);
    const req = {};
    logger.requestLogger({ stdout: false })(req, null, () => {
      try {
        assert.isOk(req.logger);
        assert.isOk(req.logger.streams);
        assert.isArray(req.logger.streams);
        const stream = _.find(req.logger.streams, { type: 'file' });
        assert.isOk(stream);
        assert.isOk(stream.path);
        assert.isTrue(stream.path.startsWith(`logs${path.sep}`));
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('Request Logger', () => {
    it('should expose req logger middleware and log req', (done) => {
      const logger = new Logger(defaultLogOptions, false);
      assert.isOk(logger);
      const req = {};

      logger.requestLogger({ stdout: false })(req, null, (...args) => {
        try {
          assert.lengthOf(args, 0);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('should attach logger to req', (done) => {
      const logger = new Logger(defaultLogOptions, false);
      assert.isOk(logger);
      const req = {};

      logger.requestLogger({ stdout: false })(req, null, (...args) => {
        try {
          assert.lengthOf(args, 0);
          assert.isOk(req.logger);
          assert.isOk(req.logger.streams);
          assert.isArray(req.logger.streams);
          // 1. stream for stdout, 2. for error.log file
          assert.isAtLeast(req.logger.streams.length, 1, 'There should be at least 1 streams');
          assert.isFunction(req.logger.info);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('should log req with info level', (done) => {
      const logger = new Logger(defaultLogOptions, false);
      assert.isOk(logger);
      const req = {
        logger: {
          info: sinon.spy(),
        },
      };

      logger.requestLogger({ stdout: false })(req, null, (...args) => {
        try {
          assert.lengthOf(args, 0);
          assert.isOk(req.logger);
          assert.calledWith(req.logger.info, { req });
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('Default logger', () => {
    it('exposes a default logger instance', () => {
      assert.isOk(logger);
      assert.isObject(logger);
      assert.isFunction(logger.error);
    });
  });
});
