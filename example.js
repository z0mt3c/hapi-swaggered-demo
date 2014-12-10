var Hapi = require('hapi');
var Joi = require('joi');
var hapiSwaggered = require('hapi-swaggered');
var hapiSwaggeredUi = require('hapi-swaggered-ui');

var server = new Hapi.Server();
server.connection({
    port: 8000,
    labels: ['api']
});

server.register({
    register: hapiSwaggered,
    options: {
        descriptions: {
            'foobar': 'Example foobar description'
        },
        info: {
            title: 'Example API',
            description: 'Tiny hapi-swaggered example'
        }
    }
}, {
    select: 'api',
    routes: {
        prefix: '/swagger'
    }
}, function(err) {
    if (err) {
        throw err;
    }
});

server.register({
    register: hapiSwaggeredUi,
    options: {
        title: 'Example API',
        authorization: {
            field: 'apiKey',
            scope: 'query' // header works as well
            // valuePrefix: 'bearer '// prefix incase
        }
    }
}, {
    select: 'api',
    routes: {
        prefix: '/docs'
    }
}, function(err) {
    if (err) {
        throw err;
    }
});


server.route({
    path: '/',
    method: 'GET',
    handler: function(request, reply) {
        reply.redirect('/docs');
    }
});

server.route({
    path: '/foobar/test',
    method: 'GET',
    config: {
        tags: ['api'],
        description: 'My route description',
        notes: 'My route notes',
        handler: function(request, reply) {
            reply({});
        }
    }
});

server.route({
    path: '/foobar/{foo}/{bar}',
    method: 'GET',
    config: {
        tags: ['api'],
        validate: {
            params: {
                foo: Joi.string().required().description('test'),
                bar: Joi.string().required()
            }
        },
        handler: function(request, reply) {
            reply({});
        }
    }
});

server.start(function() {
    console.log('started on http://localhost:8000');
});
