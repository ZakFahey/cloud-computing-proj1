const Hapi = require('hapi');
const Weather = require('./weather');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const Joi = require('joi');

async function start() {
    const server = Hapi.server({
        host: 'localhost',
        port: 8000,
        routes: {
            cors: true
        }
    });


    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Weather API Documentation',
                    version: '1.0.0'
                }
            }
        }
    ]);

    server.route({
        method: 'GET',
        path: '/historical/',
        options: {
            description: 'Gets all the dates with recorded temperatures',
            tags: ['api']
        },
        handler: function (request, h) {
            const dates = Weather.getAllDates();
            return h.response(dates);
        }
    });

    server.route({
        method: 'GET',
        path: '/historical/{date}',
        options: {
            description: 'Gets the high and low temperatures for the given date',
            tags: ['api'],
            validate: {
                params: {
                    date: Joi.string()
                        .required()
                        .description('the date to look for in YYYYMMDD format')
                }
            }
        },
        handler: function (request, h) {
            const record = Weather.getRecord(request.params.date);
            if (record === null) {
                return h.response('Record not found / invalid date format').code(404);
            }
            return h.response(record);
        }
    });

    server.route({
        method: 'POST',
        path: '/historical/',
        options: {
            description: 'Adds or updates the temperature values for the given date',
            tags: ['api'],
            validate: {
                payload: {
                    DATE: Joi.string()
                        .required()
                        .description('the date to look for in YYYYMMDD format'),
                    TMAX: Joi.number()
                        .required()
                        .description('the maximum temperature for the day in °F'),
                    TMIN: Joi.number()
                        .required()
                        .description('the minimum temperature for the day in °F')
                }
            }
        },
        handler: function (request, h) {
            Weather.addOrUpdateRecord(request.payload);
            const returnVal = { DATE: request.payload.DATE };
            return h.response(returnVal).code(201);
        }
    });

    server.route({
        method: 'DELETE',
        path: '/historical/{date}',
        options: {
            description: 'Deletes the entry for the given date',
            tags: ['api'],
            validate: {
                params: {
                    date: Joi.string()
                        .required()
                        .description('the date to delete in YYYYMMDD format')
                }
            }
        },
        handler: function (request, h) {
            const record = Weather.deleteRecord(request.params.date);
            if (record === null) {
                return h.response('Record not found / invalid date format').code(404);
            }
            return h.response(record);
        }
    });

    server.route({
        method: 'GET',
        path: '/forecast/{date}',
        options: {
            description: 'Gives the predicted weather of the next seven days starting from the given date',
            tags: ['api'],
            validate: {
                params: {
                    date: Joi.string()
                        .required()
                        .description('the date to start from in YYYYMMDD format')
                }
            }
        },
        handler: function (request, h) {
            const record = Weather.getForecast(request.params.date);
            if (record === null) {
                return h.response('Date out of range / invalid date format').code(400);
            }
            return h.response(record);
        }
    });


    server.start();
    console.log('Server running at port 8000');
}

start();