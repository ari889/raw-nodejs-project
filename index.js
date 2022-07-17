/**
 * Title: Uptime monitoring Application
 * Description: A RESTFUL pi with monitor up or down time of user defined links
 * Author: Arijit Banarjee
 * Date: 22/06/2022
 */

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environment');
const { sendTwilioSms } = require('./helpers/notifications');

// app object - module scaffolding
const app = {};

// @TODO remove latter
sendTwilioSms('1733163337', 'Hello World', (err) => {
    console.log('This is the error', err);
});
// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

// handle Request Response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
