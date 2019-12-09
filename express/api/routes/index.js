// const glob = require('glob');
const Router = require('express').Router;
const dbNames = require('../../../settings').express.routes.reactAdmin;
const apRouter = require('./maxiap');
const raRouter = require('./react-admin/index')(dbNames);
const router = Router({mergeParams: true});
router.use(apRouter);
router.use(raRouter);

module.exports = router;
// module.exports = dbNames => glob.sync('**/*.js', {cwd: `${__dirname}/`})
//     .map(filename => require(`./${filename}`))
//     .filter(router => Object.getPrototypeOf(router) === Router)
//     .reduce((rootRouter, router) =>
//         rootRouter.use(router), Router({mergeParams: true}));