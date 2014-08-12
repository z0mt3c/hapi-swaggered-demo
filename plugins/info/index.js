var Hapi = require('hapi');
var Joi = require('joi');

exports.register = function (plugin, options, next) {
    plugin.route({
        method: 'GET',
        path: '/version',
        config: {
            tags: ['api', 'test', 'test2'],
            handler: function (request, reply) {
                reply(require('../../package.json'));
            },
            response: {
                schema: Joi.object({
                    primitiveArray: Joi.array().includes(Joi.string()).optional().description('primitiveArray'),
                    skip: Joi.number().optional().default(0).description('Result offset'),
                    limit: Joi.number().optional().default(10).description('Limit of entries')
                })
            }
        }
    });

    plugin.route({
        method: 'POST',
        path: '/version/array/primitive',
        config: {
            tags: ['api', 'test'],
            validate: {
                payload: Joi.array().includes(Joi.string())
            },
            handler: function (request, reply) {
                reply([ 'string1', 'string2' ]);
            },
            response: {
                schema: Joi.array().includes(Joi.string())
            }
        }
    });

    plugin.route({
        method: 'POST',
        path: '/version/array/complex',
        config: {
            tags: ['api'],
            validate: {
                payload: Joi.array().includes(Joi.object().keys({ name: Joi.string() }))
            },
            handler: function (request, reply) {
                reply([
                    { name: 'string1' },
                    { name: 'string2' }
                ]);
            },
            response: {
                schema: Joi.array().includes(Joi.object().keys({ name: Joi.string() }))
            }
        }
    });

    plugin.route({
        method: 'POST',
        path: '/form',
        config: {
            tags: ['api'],
            validate: {
                payload: Joi.object().keys({ name: Joi.string() })
            },
            handler: function (request, reply) {
                reply(request.payload);
            },
            payload: {
                allow: 'application/x-www-form-urlencoded'
            },
            response: {
                schema: Joi.object().keys({ name: Joi.string() })
            }
        }
    });

    plugin.route({
        path: '/m/{album}/{song?}',
        method: 'GET',
        config: {
            tags: ['api'],
            validate: {
                params: {
                    album: Joi.string().required(),
                    song: Joi.string().required()
                }
            },
            handler: function(request, reply) {
                reply({});
            }
        }
    });

    plugin.route({
        path: '/n/{test*2}',
        method: 'GET',
        config: {
            tags: ['api'],
            validate: {
                params: {
                    test: Joi.array().includes(Joi.string()).required()
                }
            },
            handler: function(request, reply) {
                reply({});
            }
        }
    });


    plugin.route({
        method: 'POST',
        path: '/formData',
        config: {
            tags: ['api'],
            validate: {
                payload: Joi.object().keys({ name: Joi.string(), test: Joi.object().keys({ age: Joi.number() }),  file: Joi.any().options({ swaggerType: 'file' }) })
            },
            handler: function (request, reply) {
                console.log(request.payload);
                reply({ name: request.payload.name });
            },
            payload: {
                allow: 'multipart/form-data',
                output: 'file'
            },
            response: {
                schema: Joi.object().keys({ name: Joi.string() })
            }
        }
    });

    plugin.route({
        method: 'GET',
        path: '/',
        config: {
            tags: ['api'],
            handler: function (request, reply) {
                reply(require('../../package.json'));
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'info',
    version: '1.0.0'
};