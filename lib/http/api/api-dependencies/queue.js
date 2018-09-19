const config = require('config');
const queue = require('adsbold-kue').createQueue({
    redis: {
        host: config.get('redis.host') || '127.0.0.1',
        port: config.get('redis.port') || 6379,
        auth: config.get('redis.password') || '',
    },
    disableSearch: false
});

module.exports = queue;
