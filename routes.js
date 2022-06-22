/**
 * Title: Routes
 * Description: A RESTFUL pi with monitor up or down time of user defined links
 * Author: Arijit Banarjee
 * Date: 22/06/2022
 */
// dependencies
const { sampleHandler } = require('./handlers/routeHandler/sampleHandler');

const routes = {
    sample: sampleHandler,
};

module.exports = routes;
