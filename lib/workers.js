/**
 * Title: Workers library
 * Description: Workers related file
 * Author: Arijit Banarjee
 * Date: 22/06/2022
 */

// dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helpers/utilities');
const { sendTwilioSms } = require('../helpers/notifications');

// worker object - module scaffolding
const workers = {};

// lookup all the checks
workers.gatherAllChecks = () => {
    // get all the checks
    data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach((check) => {
                // read the check data
                data.read('checks', check, (err2, originalCheckData) => {
                    if (!err2 && originalCheckData) {
                        // pass the data to the next process
                        workers.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log('Error: reading one of the reading data');
                    }
                });
            });
        } else {
            console.log('Error: could not find any checks!');
        }
    });
};

// validate individual check data
workers.validateCheckData = (originalCheckData) => {
    const originalData = originalCheckData;
    if (originalCheckData && originalCheckData.id) {
        originalData.state = typeof (originalCheckData.state) === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';

        originalData.lastChecked = typeof (originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

        // pass to the next workers
        workers.performCheck(originalData);
    } else {
        console.log('Error: check was invalid or not properly formatted')
    }
};

// perform check
workers.performCheck = (originalCheckData) => {
    // prepare the initial check outcome
    let checkOutCome = {
        error: false,
        responseCode: false,
    };

    // mark the outcome has not been sent yet
    let outcomeSent = false;

    // parse the hostname from original data
    const parseUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    const hostName = parseUrl.hostname;
    const { path } = parseUrl;

    // contract the request
    const requestDetails = {
        protocol: `${originalCheckData.protocol}:`,
        hostname: hostName,
        method: originalCheckData.method.toUpperCase(),
        path,
        timeout: originalCheckData.timeOutSeconds * 1000,
    };

    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;

    const req = protocolToUse.request(requestDetails, (res) => {
        // grab the status of the response
        const status = res.statusCode;

        // update the check outcome and pass to the next process
        checkOutCome.responseCode = status;
        if (!outcomeSent) {
            workers.processCheckOutCome(originalCheckData, checkOutCome);
            outcomeSent = true;
        }
    });

    req.on('error', (e) => {
        checkOutCome = {
            error: true,
            value: e,
        };
        // update the check outcome and pass to the next process
        if (!outcomeSent) {
            workers.processCheckOutCome(originalCheckData, checkOutCome);
            outcomeSent = true;
        }
    });

    req.on('timeout', () => {
        checkOutCome = {
            error: true,
            value: 'timeout',
        };

        // update the check outcome and pass to the next process
        if (!outcomeSent) {
            workers.processCheckOutCome(originalCheckData, checkOutCome);
            outcomeSent = true;
        }
    });

    // req send
    req.end();
};

// save state outcome to the database
workers.processCheckOutCome = (originalCheckData, checkOutCome) => {
    // check if check outcome is up or down
    const state =
        !checkOutCome.error &&
            checkOutCome.responseCode &&
            originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
            ? 'up'
            : 'down';

    // decide wether we should alert or not
    let alertWanted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

    // update the check data
    let newCheckData = originalCheckData;

    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update the check to the disk
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            if (alertWanted) {
                // send check data to the next process
                workers.alertUserToStatusChange(newCheckData);
            } else {
                console.log('Alert is not needed as there is no state change!');
            }
        } else {
            console.log('Error: trying to save check data of one checks!');
        }
    });
};

// send notification sms to user if state changes
workers.alertUserToStatusChange = (newCheckData) => {
    let msg = `Alert : Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
    sendTwilioSms(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            console.log(`User was awaited to a status changes via sms: ${msg}`)
        } else {
            console.log('There was a problem sending sms to one of the user!');
        }
    });
};

// timer to execute the worker process
workers.loop = () => {
    setInterval(() => {
        workers.gatherAllChecks();
    }, 5000);
};

// start worker
workers.init = () => {
    // execute all the check
    workers.gatherAllChecks();

    // call the so that check continue
    workers.loop();
};

// export server
module.exports = workers;
