var Hapi = require('hapi');
var Joi = require('joi');
var hapiSwaggered = require('hapi-swaggered');
var hapiSwaggeredUi = require('hapi-swaggered-ui');

var server = new Hapi.Server();
server.connection({ port: 8000, labels: ['api'] });

server.register({
	register: hapiSwaggered,
	options: {
		descriptions: {
			'music': 'Example music description'
		},
		info: {
			title: 'Example API',
			description: 'Tiny hapi-swaggered example'
		}
	}
}, {
	select: 'api',
	route: {
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
	route: {
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
	path: '/music/test',
	method: 'GET',
	config: {
		tags: ['api'],
		handler: function(request, reply) {
			reply({});
		}
	}
});


server.route({
	path: '/music/{album}/{song}',
	method: 'GET',
	config: {
		tags: ['api'],
		validate: {
			params: {
				album: Joi.string().required().description('test'),
				song: Joi.string().required()
			}
		},
		handler: function(request, reply) {
			reply({});
		}
	}
});

server.route({
	path: '/music/simple',
	method: 'POST',
	config: {
		tags: ['api'],
		validate: {
			payload: Joi.object({
				name: Joi.string().required()
			}).description('test').options({className: 'MyClass'})
		},
		handler: function(request, reply) {
			reply({});
		}
	}
});

server.route({
	path: '/music/nested',
	method: 'POST',
	config: {
		tags: ['api'],
		validate: {
			payload: Joi.object({
				name: Joi.string().required(),
				childs: Joi.object({
					name: Joi.string().required()
				}).required()
			}).description('test2').options({className: 'MyClass2'})
		},
		handler: function(request, reply) {
			reply({});
		}
	}
});
server.route({
	path: '/music/nestedArray',
	method: 'POST',
	config: {
		tags: ['api'],
		validate: {
			payload: Joi.object({
				name: Joi.string().required(),
				childs: Joi.array().includes(Joi.object({
					name: Joi.string().required()
				})).required()
			}).description('test2').options({className: 'MyClass2'})
		},
		handler: function(request, reply) {
			reply({});
		}
	}
});

/*
server.route({
	method: 'POST',
	path: '/music/upload',
	config: {
		tags: ['api'],
		validate: {
			payload: Joi.object().keys({
				name: Joi.string(),
				album: Joi.string(),
				file: Joi.any().options({
					swaggerType: 'file'
				})
			})
		},
		handler: function(request, reply) {
			// handle file upload as specified in payload.output
			reply({
				name: request.payload.name
			});
		},
		payload: {
			allow: 'multipart/form-data',
			output: 'data'
		}
	}
});
*/

server.start(function() {
	console.log('started on http://localhost:8000');
});
