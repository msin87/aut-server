const glob = require('glob');
const Router = require('express').Router;
const apRouter = require('./maxiap');
const raRouter = require('./react-admin/index');
const
module.exports = dbNames => glob.sync('**/*.js', {cwd: `${__dirname}/`})
    .map(filename => require(`./${filename}`))
    .filter(router => Object.getPrototypeOf(router) === Router)
    .reduce((rootRouter, router) =>
        rootRouter.use(router), Router({mergeParams: true}));