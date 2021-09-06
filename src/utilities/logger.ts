import { createWriteStream } from 'fs';
import { resolve } from 'path';

import { createLogger, format, transports, addColors } from 'winston';
import morgan from 'morgan';

const { NODE_ENV } = process.env;

/** WINSTON */
const environmentLevel = () => {
    return NODE_ENV === 'DEVELOPMENT' ? 'debug' : 'warn';
};

const colors: { error: string; warn: string; info: string; http: string; debug: string } = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
addColors(colors);

const exceptionTransport = () => {
    return [new transports.File({ filename: 'logs/exception.log' })];
};
const defaultTransport = () => {
    let transport;
    if (NODE_ENV === 'DEVELOPMENT') {
        transport = [
            new transports.Console({ level: 'error' }),
            new transports.File({ level: 'error', filename: 'logs/error.log' }),
            new transports.File({ filename: 'logs/combined.log' }),
        ];
    } else {
        transport = [
            new transports.File({ level: 'warn', filename: 'logs/warn.log' }),
            new transports.File({ level: 'error', filename: 'logs/error.log' }),
            new transports.File({ filename: 'logs/combined.log' }),
        ];
    }
    return transport;
};

const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf(
        (info) => `[${info.timestamp as string} : ${info.label as string}] - ${info.message}`,
    ),
);

const levels: { error: number; warn: number; info: number; http: number; debug: number } = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

export const Logger = createLogger({
    level: environmentLevel(),
    transports: defaultTransport(),
    exceptionHandlers: exceptionTransport(),
    format: logFormat,
    levels,
    exitOnError: false,
});

/** MORGAN */
const devFormat = ':method :url HTTP/:http-version | :status :response-time ms';
export const MorganDevelopmentFormat = morgan(devFormat);

const prodFormat =
    '[:date[web] :remote-addr :remote-user ] :method :url HTTP/:http-version :referrer - :user-agent | :status :response-time ms';
const requestLogStream = createWriteStream(resolve(__dirname, '../../logs/request.log'), {
    flags: 'a',
});
export const MorganProductionFormat = morgan(prodFormat, { stream: requestLogStream });
