const { createLogger, format, transports } = require('winston')

const logger = defaultConfig =>
    createLogger({
        transports: [
            new transports.Console({
                handleExceptions: true,
                format: format.json(),
            }),
        ],
    })

module.exports = {
    logger,
}