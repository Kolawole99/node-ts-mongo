import { createWriteStream } from 'fs';
import { resolve } from 'path';

import { createLogger, format, transports, addColors } from 'winston';
import morgan from 'morgan';

const { NODE_ENV } = process.env;

/** WINSTON */
const environmentLevel  = () => {
    return NODE_ENV === 'DEVELOPMENT' ? 'debug' : 'warn'
}

const colors: {} = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}
addColors(colors);

const defaultTransport  = () => {
    let transport;
    if (NODE_ENV === 'DEVELOPMENT') {
        transport = [
            new transports.Console({ level: 'error' }),
            new transports.File({ filename: 'logs/combined.log' }),
        ]
    } else {
        transport = [
            new transports.File({ level: 'info', filename: 'logs/info.log' }),
            new transports.File({ level: 'warn', filename: 'logs/warn.log' }),
            new transports.File({ level: 'error', filename: 'logs/error.log' }),
            new transports.File({ filename: 'logs/combined.log' }),
        ]
    }
    return transport;
}
const exceptionTransport = () => {
    return [new transports.File({ filename: 'logs/exception.log' })];
}

const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf((info) => `[${info.timestamp} : ${info.level}][${info.label}] - ${info.message}`),
)

const levels: {} = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}

export const Logger = createLogger({
    level: environmentLevel(),
    transports: defaultTransport(),
    exceptionHandlers: exceptionTransport(),
    format: logFormat,
    levels,
    exitOnError: false,
})


/** MORGAN */
const devFormat =
    '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version | :status :response-time ms';
const prodFormat =
    '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version :referrer - :user-agent | :status :response-time ms';

const morganFormat = NODE_ENV === 'DEVELOPMENT' ? devFormat : prodFormat;
const requestLogStream = createWriteStream(resolve(__dirname, '../../logs/request.log'), {flags: 'a'});

export const Morgan = morgan(morganFormat, { stream: requestLogStream });
