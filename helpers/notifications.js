/**
 * Title: Handle Notification Library
 * Description: Importent function to notify user
 * Author: Arijit Banarjee
 * Date: 22/06/2022
 */

// dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environment');

// module scaffolding
const notifications = {};

// send sms to user
notifications.sendTwilioSms = (phone, msg, callback) => {
    // input validation
    const userPhone = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;

    const userMsg =
        typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600
            ? msg.trim()
            : false;

    if (userPhone && userMsg) {
        // configure the request
        const payload = {
            From: twilio.fromPhone,
            To: `+880${userPhone}`,
            Body: userMsg,
        };

        // stringify
        const stringifyPayload = querystring.stringify(payload);

        // configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-from-urlencoded',
            },
        };

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the send request
            const status = res.statusCode;

            // callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(stringifyPayload);
        req.end();
    } else {
        callback('Given Parameter were missing or invalid');
    }
};

// export the module
module.exports = notifications;
