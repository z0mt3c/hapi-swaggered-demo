var Hapi = require('hapi')
var Joi = require('joi')
var hapiSwaggered = require('hapi-swaggered')
var hapiSwaggeredUi = require('hapi-swaggered-ui')

var server = new Hapi.Server()
server.connection({
  port: 8000,
  labels: ['api']
})

server.register({
  register: hapiSwaggered,
  options: {
    // cache: false,
    stripPrefix: '/api',
    responseValidation: false,
    descriptions: {
      'foobar': 'Example foobar description'
    },
    info: {
      title: 'Example API',
      description: 'Powered by node, hapi, joi, hapi-swaggered, hapi-swaggered-ui and swagger-ui',
      version: '1.0'
    }
  }
}, {
  select: 'api',
  routes: {
    prefix: '/swagger'
  }
}, function (err) {
  if (err) {
    throw err
  }
})

server.register({
  register: hapiSwaggeredUi,
  options: {
    title: 'Example API',
    authorization: {
      field: 'apiKey',
      scope: 'query', // header works as well
      // valuePrefix: 'bearer '// prefix incase
      defaultValue: 'demoKey',
      placeholder: 'Enter your apiKey here'
    }
  }
}, {
  select: 'api',
  routes: {
    prefix: '/docs'
  }
}, function (err) {
  if (err) {
    throw err
  }
})

server.route({
  path: '/',
  method: 'GET',
  handler: function (request, reply) {
    reply.redirect('/docs')
  }
})

server.route({
  path: '/api/foobar/test',
  method: 'GET',
  config: {
    tags: ['api'],
    description: 'My route description',
    notes: 'My route notes',
    handler: function (request, reply) {
      reply({})
    }
  }
})

server.route({
  path: '/api/foobar/{foo}/{bar}',
  method: 'GET',
  config: {
    tags: ['api'],
    validate: {
      params: {
        foo: Joi.string().required().description('test'),
        bar: Joi.string().required()
      }
    },
    handler: function (request, reply) {
      reply({})
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/test/fileUpload',
  config: {
    tags: ['api'],
    validate: {
      payload: Joi.object().keys({ name: Joi.string(), file: Joi.any().meta({ swaggerType: 'file' }) })
    },
    handler: function (request, reply) {
      // handle file upload as specified in payload.output
      reply({ name: request.payload.name })
    },
    payload: {
      allow: 'multipart/form-data',
      output: 'data'
    }
  }
})

server.register({
  register: require('./plugins/info'),
  options: {}
}, { routes: { prefix: '/api/version' }}, function (error) {
  if (error) {
    throw error
  }
})

server.start(function () {
  console.log('started on http://localhost:8000')
})
