/*
 * Title: Environments
 * Description: Handle all environment related things
 * Author: Arijit Banarjee
 * Date: 11/20/2020
 *
 */

// dependencies

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'asdasdasfdsdfghfdfgdfg',
    maxChecks: 5,
    twilio: {
        fromPhone: '888-111-1020',
        accountSid: 'ACbdb513a7eb45cb925f4adc1e1591a2c7',
        authToken: 'f429a42b5672f6e577dae0dc42217acf',
    },
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'gfdfgdfhfghjghjgrtyr',
    maxChecks: 5,
    twilio: {
        fromPhone: '888-111-1020',
        accountSid: 'ACbdb513a7eb45cb925f4adc1e1591a2c7',
        authToken: 'f429a42b5672f6e577dae0dc42217acf',
    },
};

// determine which environment was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// Accessing property value
module.exports = environmentToExport;
