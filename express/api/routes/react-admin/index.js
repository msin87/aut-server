const Factory = require('../../../factory/react-admin/router');
const Router = require('express').Router;
const routes = dbNames => {
    const controllers = require('../../controllers/react-admin/index')(dbNames);
    const router = dbNames.reduce((rootRouter, dbName) => {
        const route = Factory('/' + dbName, controllers[dbName]);
        return rootRouter.use(route);
    }, Router({mergeParams: true}));
    return router;
};
module.exports = routes;