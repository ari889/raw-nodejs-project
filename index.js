/**
 * Title: Initial File
 * Description: Initial file to start the node server and worker
 * Author: Arijit Banarjee
 * Date: 22/06/2022
 */

// dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');

// app object - module scaffolding
const app = {};

app.init = () => {
    // start the server
    server.init();

    // start the worker
    workers.init();
};

app.init();

// export the app
module.exports = app;
