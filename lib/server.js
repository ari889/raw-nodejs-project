/**
 * Title: Server library
 * Description: Server related file
 * Author: Arijit Banarjee
 * Date: 22/06/2022
 */

// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environment');

// app object - module scaffolding
const server = {};

// create server
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

// handle Request Response
server.handleReqRes = handleReqRes;

// start server
server.init = () => {
    server.createServer();
};

// export server
module.exports = server;
