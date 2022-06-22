/**
 * Title: Uptime monitoring Application
 * Description: A RESTFUL pi with monitor up or down time of user defined links
 * Author: Arijit Banarjee
 * Date: 22/06/2022
 */

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening to port ${app.config.port}`);
    });
};

// handle Request Response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
