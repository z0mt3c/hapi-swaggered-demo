var Joi = require('joi')

exports.register = function (plugin, options, next) {
  plugin.route({
    method: 'GET',
    path: '/version',
    config: {
      tags: ['api', 'test', 'test2'],
      handler: function (request, reply) {
        reply(require('../../package.json'))
      },
      response: {
        schema: Joi.object({
          primitiveArray: Joi.array().items(Joi.string()).optional().description('primitiveArray'),
          skip: Joi.number().optional().default(0).description('Result offset'),
          limit: Joi.number().optional().default(10).description('Limit of entries')
        })
      }
    }
  })

  plugin.route({
    method: 'POST',
    path: '/version/array/primitive',
    config: {
      tags: ['api', 'test'],
      validate: {
        payload: Joi.array().items(Joi.string())
      },
      handler: function (request, reply) {
        reply([ 'string1', 'string2' ])
      },
      response: {
        schema: Joi.array().items(Joi.string())
      }
    }
  })

  plugin.route({
    method: '*',
    path: '/version/wildcard/route',
    config: {
      tags: ['api', 'test'],
      validate: {
        query: Joi.object({ name: Joi.string() })
      },
      handler: function (request, reply) {
        reply([ 'string1', 'string2' ])
      }
    }
  })

  plugin.route({
    method: 'POST',
    path: '/version/array/complex',
    config: {
      tags: ['api'],
      validate: {
        payload: Joi.array().items(Joi.object().keys({ name: Joi.string() }))
      },
      handler: function (request, reply) {
        reply([
          { name: 'string1' },
          { name: 'string2' }
        ])
      },
      response: {
        schema: Joi.array().items(Joi.object().keys({ name: Joi.string() }))
      }
    }
  })

  plugin.route({
    method: 'POST',
    path: '/version/any',
    config: {
      tags: ['api'],
      validate: {
        payload: Joi.any(),
        query: Joi.any()
      },
      handler: function (request, reply) {
        reply([
          { name: 'string1' },
          { name: 'string2' }
        ])
      },
      response: {
        schema: Joi.any()
      }
    }
  })

  plugin.route({
    method: 'POST',
    path: '/version/any/2',
    config: {
      tags: ['api'],
      validate: {
        payload: Joi.object({ test: Joi.any() }),
        query: Joi.object({ test: Joi.any() })
      },
      handler: function (request, reply) {
        reply([
          { name: 'string1' },
          { name: 'string2' }
        ])
      },
      response: {
        schema: Joi.object({ any: Joi.any() })
      }
    }
  })

  plugin.route({
    method: 'POST',
    path: '/form',
    config: {
      tags: ['api'],
      validate: {
        payload: Joi.object().keys({ name: Joi.string() })
      },
      handler: function (request, reply) {
        reply(request.payload)
      },
      payload: {
        allow: 'application/x-www-form-urlencoded'
      },
      response: {
        schema: Joi.object().keys({ name: Joi.string() })
      }
    }
  })

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
      handler: function (request, reply) {
        reply({})
      }
    }
  })

  plugin.route({
    path: '/n/{test*2}',
    method: 'GET',
    config: {
      tags: ['api'],
      validate: {
        params: {
          test: Joi.array().items(Joi.string()).required()
        }
      },
      handler: function (request, reply) {
        reply({})
      }
    }
  })

  plugin.route({
    method: 'POST',
    path: '/formData',
    config: {
      tags: ['api'],
      validate: {
        payload: Joi.object().keys({
          name: Joi.string(),
          test: Joi.object().keys({ age: Joi.number() }),
          file: Joi.any().meta({ swaggerType: 'file' })
        })
      },
      handler: function (request, reply) {
        reply({ name: request.payload.name })
      },
      payload: {
        allow: 'multipart/form-data',
        output: 'file'
      },
      response: {
        schema: Joi.object().keys({ name: Joi.string() })
      }
    }
  })

  plugin.route({
    method: 'GET',
    path: '/',
    config: {
      tags: ['api'],
      handler: function (request, reply) {
        reply(require('../../package.json'))
      }
    }
  })

  plugin.route({
    method: 'POST',
    path: '/payload/primitive/string',
    config: {
      tags: ['api', 'response', 'primitive'],
      validate: {payload: Joi.string().description('string!')},
      response: {schema: Joi.string().description('string!')},
      handler: function (request, reply) {
        reply(require('../../package.json'))
      }
    }
  })

  plugin.route({
    method: 'POST',
    path: '/payload/primitive/number',
    config: {
      tags: ['api', 'response', 'primitive'],
      validate: {payload: Joi.number().description('number!')},
      response: {schema: Joi.number().description('number!')},
      handler: function (request, reply) {
        reply(require('../../package.json'))
      }
    }
  })

  next()
}

exports.register.attributes = {
  name: 'info',
  version: '1.0.0'
}
