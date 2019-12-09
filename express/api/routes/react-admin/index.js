const Factory = require('../../../factory/react-admin/router');
const Router = require('express').Router;
const routes = dbNames => {
    const controllers = require('../../controllers/react-admin/index')(dbNames);
    const router = dbNames.reduce((rootRouter,dbName)=>
        rootRouter.use(Factory('/'+dbName,controllers[dbName])), Router({mergeParams: true}));
    return router;
};
module.exports = routes;