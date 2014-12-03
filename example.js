var Hapi = require('hapi');
var Joi = require('joi');
var hapiSwaggered = require('hapi-swaggered');
var hapiSwaggeredUi = require('hapi-swaggered-ui');

var server = new Hapi.Server();
server.connection({ port: 8000, labels: ['api'], app: {
		swagger: {
			info: {
				title: 'Example API2',
				description: 'Tiny hapi-swaggered example2'
			}
		}
} });

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

server.start(function() {
	console.log('started on http://localhost:8000');
});
