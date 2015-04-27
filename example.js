var Hapi = require('hapi')
var Joi = require('joi')
var hapiSwaggered = require('hapi-swaggered')
var hapiSwaggeredUi = require('hapi-swaggered-ui')

var server = module.exports = new Hapi.Server()
server.connection({
  port: process.env.PORT || 8000,
  labels: ['api'],
  routes: {
    json: {
      space: 2
    }
  }
})

server.register({
  register: hapiSwaggered,
  options: {
    cache: false,
    stripPrefix: '/api',
    responseValidation: false,
    tags: {
      '/foobar': 'Example foobar description'
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

server.route({
  method: 'GET',
  path: '/api/responses/array',
  config: {
    tags: ['api', 'response'],
    validate: {
      query: Joi.object().keys({ name: Joi.string() })
    },
    handler: function (request, reply) {
      reply({ name: 'test' })
    },
    response: {
      schema: Joi.array().items(Joi.string().description('name')).description('test'),
      status: {
        500: Joi.array().items(Joi.string().description('name')).description('test'),
        // Produces invalid schema due to missing array items: 501: Joi.array().description('test1'),
        502: Joi.array().items(Joi.number().integer()).description('num'),
        503: Joi.array().items(Joi.object({ name: Joi.string() }).meta({className: 'TestModel'})).description('num')
      }
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/responses/primitive',
  config: {
    tags: ['api', 'response'],
    validate: {
      query: Joi.object().keys({ name: Joi.string() })
    },
    handler: function (request, reply) {
      reply({ name: 'test' })
    },
    response: {
      schema: Joi.string().description('test'),
      status: {
        500: Joi.string().description('test'),
        501: Joi.number().description('number!'),
        502: Joi.number().description('integer!')
      }
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
