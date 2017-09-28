var Hapi = require('hapi')
var Joi = require('joi')

var server = module.exports = new Hapi.Server()
server.connection({
  port: process.env.PORT || 8000,
  labels: ['api'],
  router: {
    stripTrailingSlash: true
  },
  routes: {
    json: {
      space: 2
    }
  }
})

server.register([
  require('inert'),
  require('vision'),
  {
    register: require('hapi-swaggered'),
    options: {
      cache: false,
      stripPrefix: '/api',
      responseValidation: true,
      tagging: {
        mode: 'path',
        pathLevel: 1
      },
      tags: {
        'foobar': 'Example foobar description'
      },
      info: {
        title: 'Example API',
        description: 'Powered by node, hapi, joi, hapi-swaggered, hapi-swaggered-ui and swagger-ui',
        version: '1.0'
      }
    }
  },
  {
    register: require('hapi-swaggered-ui'),
    options: {
      title: 'Example API',
      path: '/docs',
      authorization: {
        field: 'apiKey',
        scope: 'query', // header works as well
        // valuePrefix: 'bearer '// prefix incase
        defaultValue: 'demoKey',
        placeholder: 'Enter your apiKey here'
      },
      swaggerOptions: {
        validatorUrl: null
      }
    }
  }], {
    select: 'api'
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
  path: '/api/date',
  method: 'GET',
  config: {
    tags: ['api'],
    validate: {
      query: {
        foo: Joi.string().required().description('test'),
        test: Joi.date().required().meta({swaggerType: 'string', format: 'date-time'})
      }
    },
    handler: function (request, reply) {
      reply({})
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/file/upload',
  config: {
    tags: ['api', 'file'],
    validate: {
      payload: Joi.object({
        name: Joi.string(),
        file: Joi.object().meta({ swaggerType: 'file' })
      })
    },
    handler: function (request, reply) {
      // handle file upload as specified in payload.output
      reply({})
    },
    payload: {
      allow: 'multipart/form-data',
      output: 'data'
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/form-data',
  config: {
    tags: ['api', 'file'],
    validate: {
      payload: Joi.object({
        name: Joi.string()
      })
    },
    handler: function (request, reply) {
      // handle file upload as specified in payload.output
      reply({})
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

server.route({
  method: 'POST',
  path: '/api/issue16/test',
  config: {
    tags: ['api', 'issue16'],
    validate: {
      payload: Joi.object({
        playerIds: Joi.array().items(Joi.string().guid()).required()
      })
    },
    handler: function (request, reply) {
      reply({ name: 'test' })
    }
  }
})

server.route({
  method: 'DELETE',
  path: '/api/issue16/test2',
  config: {
    tags: ['api', 'issue16'],
    validate: {
      payload: Joi.object({
        playerIds: Joi.array().items(Joi.string().guid()).required()
      })
    },
    handler: function (request, reply) {
      reply({ name: 'test' })
    }
  }
})

var kindSeparator = Joi.object({
  pagingKind: Joi.string().required()['default']('separator').example('separator').description('Specifies the kind of page.').valid('separator')
}).description('Instruction to render a page separator').meta({
  className: 'PaginationPageSeparator'
}).options({
  allowUnknown: true,
  stripUnknown: true
})

var kindPage = Joi.object({
  pagingKind: Joi.string().required()['default']('page').example('page').description('Specifies the kind of page.').valid(['page']),
  pageNumber: Joi.number().integer()['default'](0).example(0).description('The zero based page number of this page.').required(),
  pageNumberDisplay: Joi.string()['default']('1').example('1').description('The one based page number as a string, useful for displaying to the end user.').required(),
  active: Joi.boolean()['default'](false).example(true).description('Boolean that indicates that this item is the currently active page.').required()
}).description('The description of a single page').meta({
  className: 'PaginationPagePage'
}).options({
  allowUnknown: true,
  stripUnknown: true
})

var schema = Joi.alternatives(kindPage, kindSeparator).description('The description of a single page').meta({
  className: 'PaginationPage'
}).options({
  allowUnknown: true,
  stripUnknown: true
})

server.route({
  method: 'POST',
  path: '/api/alternatives',
  config: {
    tags: ['api', 'alternatives'],
    validate: {
      payload: schema
    },
    handler: function (request, reply) {
      reply({ name: 'test' })
    }
  }
})

server.route({
  method: 'POST',
  path: '/api/issue38/test',
  config: {
    tags: ['api', 'issue38'],
    validate: {
      payload: Joi.object({
        player: Joi.object().max(1),
        test2: Joi.array().items(Joi.object()).max(1)
      })
    },
    handler: function (request, reply) {
      reply({ name: 'test' })
    }
  }
})

server.route({
  path: '/api/array/of/array/{foo}/{bar}',
  method: 'POST',
  config: {
    tags: ['api'],
    validate: {
      params: {
        foo: Joi.string().required().description('test'),
        bar: Joi.object({
          a: Joi.object({
            test: Joi.number().integer().required()
          }).required(),
          b: Joi.array().items(Joi.array().items(Joi.number()).length(2)).min(1).required()
        }).meta({swaggerType: 'string'}).description('Lorem').required()
      },
      payload: {
        foo: Joi.string().required().description('test'),
        bar: Joi.object({
          a: Joi.object({
            test: Joi.number().integer().required()
          }).required(),
          b: Joi.array().items(Joi.array().items(Joi.number()).length(2)).min(1).required()
        }).meta({className: 'Problem'}).required()
      }
    },
    handler: function (request, reply) {
      reply(request.params)
    }
  }
})

server.register({
  register: require('./plugins/info'),
  options: {}
}, {routes: { prefix: '/api/version' }}, function (error) {
  if (error) {
    throw error
  }
})

server.start(function () {
  console.log('started on http://localhost:8000')
})
