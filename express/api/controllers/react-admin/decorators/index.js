const glob = require('glob');
const decorators = glob.sync('**/*.js', {cwd: `${__dirname}/`, ignore: 'index.js'})
    .map(filename =>
        require(`./${filename}`));
const wrapper = decorators => dbApi => {
    const originMethods = Object.assign({}, dbApi);
    for (let methodName in dbApi) {
        dbApi[methodName] = (...args) => {
            decorators.forEach(decorator =>
                decorator(...args));
            originMethods[methodName](...args);
        }
    }

    return dbApi;
};


module.exports = wrapper(decorators);