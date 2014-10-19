var Hapi = require('hapi');
var Joi = require('joi');
var hapiSwaggered = require('hapi-swaggered');
var hapiSwaggeredUi = require('hapi-swaggered-ui');

var server = Hapi.createServer('localhost', 8000, {
	labels: ['api']
});

server.pack.register({
	plugin: hapiSwaggered,
	options: {
		apiVersion: '999',
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

server.pack.register({
	plugin: hapiSwaggeredUi,
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
	path: '/music/{album}/{song}',
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

server.start(function() {
	console.log('started on http://localhost:8000');
});
