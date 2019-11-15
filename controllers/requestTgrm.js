const carsController = require('./cars');
const usersController = require('./users');
module.exports = async (req, res) => {
    switch (+req.query['cmd']) {
        case 19000: //get server status
            res.sendStatus(200);
            break;
        case 19001:     //get all users
            await usersController.getAll(req,res);
            break;
        case 19002:     //confirm validation code. register new user
            await usersController.registerNewUser(req, res);
            break;
        case 19003:     //get user by query
            await usersController.getByQuery(req, res);
            break;
        case 19004:     //update user
            await usersController.update(req, res);
            break;
        case 19005:
            await usersController.setNewValidDate(req, res);
            break;
    }
};