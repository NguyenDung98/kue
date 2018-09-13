'use strict';

const config = require('config');
const moment = require('moment');

function getLogTime() {
    return moment().format('DD/MM/YYYY H:m');
}

exports.info = (tag, message) => {
    console.log(getLogTime(), config.get('server.alias'), tag, message);
};

exports.error = (tag, message) => {
    console.log(getLogTime(), config.get('server.alias'), tag, message);
};

