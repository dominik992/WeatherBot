import bunyan from 'bunyan';
import path from 'path';

import loggingConfig from '../../config/logging';

const DEFAULT_LOG_LEVEL = 'info';
const DEFAULT_LOG_DIR = 'logs';
const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

const defaultLoggerOptions = {
  src: false,
  stdout: true,
  name: 'weather-bot',
  logLevel: DEFAULT_LOG_LEVEL,
  logDir: DEFAULT_LOG_DIR,
};
const serializers = {
  err: bunyan.stdSerializers.err,
  req: bunyan.stdSerializers.req,
  res: bunyan.stdSerializers.res,
};

function getFileStream(level, logDir) {
  return {
    level,
    path: path.join(logDir, `${level}.log`),
  };
}

function buildLogger(options = defaultLoggerOptions, loggingConf = loggingConfig) {
  const logDir = options.logDir || loggingConf.logDir;
  const streams = [getFileStream('error', logDir)];

  if (options.stdout) {
    streams.push({
      level: options.logLevel || loggingConf.logLevel,
      stream: process.stdout,
    });
  }

  if (options.extraFileLogLevel && options.extraFileLogLevel.length > 0) {
    streams.push(getFileStream(options.extraFileLogLevel, logDir));
  }

  return bunyan.createLogger({
    name: options.name || defaultLoggerOptions.name,
    serializers,
    streams,
    src: Boolean(options.src),
  });
}

function getLogLevel(level = DEFAULT_LOG_LEVEL) {
  const checkedLevel = level.toLowerCase();
  if (LOG_LEVELS.indexOf(checkedLevel) === -1) {
    throw new Error(`${level} is not a valid log level and should be one of ${LOG_LEVELS}`);
  }
  return checkedLevel;
}

function getLogDir(logDir, isProd) {
  if (isProd && !logDir) {
    throw new Error('LOG_DIR env var is not set properly.');
  }
  // resorting to DEFAULT_LOG_DIR is not allowed for production
  return logDir || DEFAULT_LOG_DIR;
}

/*
 Utility class for logging.
 */
export class Logger {
  /**
   * Creates an instance of the logger.
   * @param {object} loggingConf the configuration that holds logDir and logLevel properties.
   * @param {boolean} prodEnv is code running in prod environment.
   * If not in prod logDir can be omitted and it will default to process.env.PWD/logs dir.
   * @throws {Error} if logLevel is not valid or logDir not set in prod.
   */
  constructor(loggingConf, prodEnv = false) {
    this.loggingConf = loggingConf;
    this.loggingConf.logLevel = getLogLevel(this.loggingConf.logLevel);
    this.loggingConf.logDir = getLogDir(this.loggingConf.logDir, prodEnv);
    this.requestLogger = this.requestLogger.bind(this);
  }

  /*
   Builds a request logger, logs req and assigns logger to req.logger
   */
  requestLogger(options = defaultLoggerOptions) {
    let logger = null;
    try {
      // make logger avail in requests;
      logger = buildLogger(options, this.loggingConf);
    } catch (e) {
      // so using console as last resort
      console.error('Error when creating logger', e); // eslint-disable-line no-console
    }

    return (req, res, next) => {
      if (!req.logger) {
        req.logger = logger;
      }

      try {
        req.logger.info({ req });
      } catch (e) {
        console.error('Error while logging request', e); // eslint-disable-line no-console
      } finally {
        next();
      }
    };
  }
}

/*
 Export a logger for usage
 */
function buildDefaultLogger() {
  const isProd = process.env.NODE_EVN === 'production';
  const options = {
    logLevel: getLogLevel(loggingConfig.logLevel),
    logDir: getLogDir(loggingConfig.logDir, isProd),
    src: !isProd,
    stdout: !isProd,
  };

  return buildLogger(options);
}

const logger = buildDefaultLogger();
export default logger;
