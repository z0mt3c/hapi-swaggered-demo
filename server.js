var logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    timestamp: true
});

var _ = require('lodash');
var Hapi = require('hapi');

logger.info('Powered by HAPI ' + Hapi.version);

var manifest = {
    pack: {
        cache: 'catbox-memory'
    },
    servers: [
        {
            port: 9000,
            options: {
                labels: ['api'],
                validation: {
                    //stripUnknown: true
                },
                app: {
                    swagger: {
                        descriptions: {
                        },
                        info: {
                            title: "hapi-swaggered-demo (Public)",
                            description: "Description of a REST api powered by hapi and nodejs."
                        }
                    }
                }
            }
        },
        {
            port: 9001,
            options: {
                labels: ['internal'],
                validation: {
                    //stripUnknown: true
                },
                app: {
                    swagger: {
                        stripPrefix: '/api',
                        descriptions: {
                            'test': 'overwritten in interal'
                        },
                        info: {
                            title: "hapi-swaggered-demo (Internal)",
                            description: "Description of a REST api powered by hapi and nodejs."
                        }
                    }
                }
            }
        }
    ],
    plugins: {
        './info': [
            {
                select: 'api',
                route: {
                    prefix: '/test'
                },
                options: {}
            },
            {
                select: 'internal',
                route: {
                    prefix: '/api/test'
                },
                options: {}
            }
        ],
        'hapi-swaggered': [
            {
                select: ['api', 'internal'],
                route: {
                    prefix: '/swagger'
                },
                options: {
                    endpoint: '/api-docs',
                    apiVersion: require('./package.json').version,
                    descriptions: {
                        'test': 'overwrite me in interal'
                    }
                }
            }
        ],
        'hapi-swaggered-ui': [
            {
                select: ['api', 'internal'],
                route: {
                    prefix: '/docs'
                },
                options: {
                    title: 'hapi-swaggered-demo',
                    authorization: {
                        field: 'Authorization',
                        scope: 'header',
                        valuePrefix: 'bearer '
                    }
                }
            }
        ]
    }
};

Hapi.Pack.compose(manifest, {
    relativeTo: require('path').join(__dirname, 'plugins')
}, function (err, pack) {
    if (err) {
        logger.log('error', 'Error during composition', err);
        return;
    }

    pack.start(function () {
        logger.log('info', '');
        logger.log('info', 'Servers are listening:');

        _.each(pack._servers, function (server) {
            logger.log('info', '- Server [ ' + server.settings.labels.join(', ') + ' ] listening on Port ' + server.info.port);
        });

        logger.log('info', '');
    });
});