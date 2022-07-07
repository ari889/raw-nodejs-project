/**
 * Title: Routes
 * Description: A RESTFUL pi with monitor up or down time of user defined links
 * Author: Arijit Banarjee
 * Date: 22/06/2022
 */
// dependencies
const { sampleHandler } = require('./handlers/routeHandler/sampleHandler');
const { userHandler } = require('./handlers/routeHandler/userHandler');
const { tokenHandler } = require('./handlers/routeHandler/tokenHandler');
const { checkHandler } = require('./handlers/routeHandler/checkHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler
};

module.exports = routes;
