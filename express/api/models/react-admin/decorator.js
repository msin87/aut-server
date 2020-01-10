const ws = require('../../../../websocket');
const wsDecorator = func => {

}
const decorateFunc=(func,decorator)=>{
    decorator();
    return func;
}