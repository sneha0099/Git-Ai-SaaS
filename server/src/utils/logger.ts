import { createLogger, format, transports } from 'winston';
import moment from 'moment';

const customFormat = format.printf(({ level, message, timestamp, ...meta }) => {
    return (
        `[${timestamp}] ${level.toUpperCase()}: ${message}\n` +
        `→ Status: ${meta.statusCode || 'N/A'} | Method: ${meta.method || 'N/A'} | URL: ${meta.url || 'N/A'} | IP: ${meta.ip || 'N/A'}\n` +
        `→ Data: ${JSON.stringify(meta.data ?? null)}`
    );
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.errors({ stack: true }),
        format.timestamp({
            format: () => moment().format('DD-MM-YYYY hh:mm:ss A'),
        }),
        customFormat
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});

// Log to console in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            format: format.combine(format.colorize({ all: true })),
        })
    );
}

export default logger;
