/**
 * Title: Utilities
 * Description: Handle request and response
 * Author: Arijit Banarjee
 * Date: 22/06/2022
 */

// dependencies
const crypto = require('crypto');
const environments = require('./environment');

// module scaffolding
const Utilities = {};

// parse json string to object
Utilities.parseJSON = (jsonString) => {
    let output = {};
    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        output = {};
    }

    return output;
};


// hash string
Utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        let hash = crypto.createHmac('sha256', environments.secretKey)
            .update(str)
            .digest('hex');
        return hash;
    }
    return false;
};

// create random string
Utilities.createRandomString = (stringLength) => {
    let length = stringLength;
    length = typeof stringLength === 'number' && stringLength > 0 ? stringLength : false;

    if (length) {
        const possiblecharanters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomCharacter = possiblecharanters.charAt(
                Math.floor(Math.random() * possiblecharanters.length)
            );
            output += randomCharacter;
        }
        return output;
    }

    return false;
};

module.exports = Utilities;
