/**
 * Title: Not handler
 * Description: A RESTFUL pi with monitor up or down time of user defined links
 * Author: Arijit Banarjee
 * Date: 22/06/2022
 */

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Your requested url not found!',
    });
};

module.exports = handler;
