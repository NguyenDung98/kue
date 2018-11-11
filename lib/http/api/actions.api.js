const api = require('express').Router();
const kue = require('adsbold-kue');
const reds = require('reds');
const queue = require('./api-dependencies/queue');

const {fail, success} = require('./api-dependencies/utils/response-util');
const logger = require('./api-dependencies/utils/logger');
const {check, oneOf, validationResult} = require('express-validator/check');

api.post(
    '/actions/restart-active',
    async (req, res) => {
        try {
            const restartJobs = await restartAllActive();
            return res.json(success({restart_active_count: restartJobs.length}));
        } catch (err) {
            logger.error(`${req.method} ${req.originalUrl}`, err.message);
            return res.json(fail(err.message));
        }
    }
);

api.post(
    '/actions/restart-failed',
    async (req, res) => {
        try {
            const restartJobs = await restartAllFailed();
            return res.json(success({restart_failed_count: restartJobs.length}));
        } catch (err) {
            logger.error(`${req.method} ${req.originalUrl}`, err.message);
            return res.json(fail(err.message));
        }
    }
);

api.post(
    '/actions/remove-complete',
    async (req, res) => {
        try {
            const removeJobs = await removeAllComplete();
            return res.json(success({remove_count: removeJobs.length}));
        } catch (err) {
            logger.error(`${req.method} ${req.originalUrl}`, err.message);
            return res.json(fail(err.message));
        }
    }
);

api.post(
    '/actions/remove-failed',
    async (req, res) => {
        try {
            const removeJobs = await removeAllFailed();
            return res.json(success({remove_count: removeJobs.length}));
        } catch (err) {
            logger.error(`${req.method} ${req.originalUrl}`, err.message);
            return res.json(fail(err.message));
        }
    }
);


function restartAllActive() {
    return new Promise((resolve, reject) => {
        queue.active(function (err, ids) {
            if (err) return reject(err);
            const restartPromises = ids.map((id) => {
                return restart(id);
            });
            return resolve(Promise.all(restartPromises));
        });
    });
}

function restartAllFailed() {
    return new Promise((resolve, reject) => {
        queue.failed(function (err, ids) {
            if (err) return reject(err);
            const restartPromises = ids.map((id) => {
                return restart(id);
            });
            return resolve(Promise.all(restartPromises));
        });
    });
}

function restart(id) {
    return new Promise((resolve, reject) => {
        kue.Job.get(id, function (err, job) {
            if (err) return reject(err);
            job.inactive();
            resolve(id);
        });
    });
}

function removeAllComplete() {
    return new Promise((resolve, reject) => {
        queue.complete(function (err, ids) {
            if (err) return reject(err);
            const removePromises = ids.map((id) => {
                return remove(id);
            });
            return resolve(Promise.all(removePromises));
        });
    });
}

function removeAllFailed() {
    return new Promise((resolve, reject) => {
        queue.failed(function (err, ids) {
            if (err) return reject(err);
            const removePromises = ids.map((id) => {
                return remove(id);
            });
            return resolve(Promise.all(removePromises));
        });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        kue.Job.get(id, function (err, job) {
            if (err) return reject(err);
            job.remove();
            resolve(id);
        });
    });
}

module.exports = api;
