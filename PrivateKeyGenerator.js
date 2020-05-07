'use strict';
const ora = require('ora');
const prompt  = require('prompts');
const keythereum = require('keythereum');
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const KEYSTORE_PATH = './assets/keystore/';

(async () => {
    let response = await prompt([
        {
            type: 'select',
            name: 'keystoreFile',
            message: 'Choose the Keystore File:',
            choices: fs.readdirSync(KEYSTORE_PATH)
                .map(file => Object({title: file, value: file}))
        },
        {
            type: 'text',
            name: 'password',
            message: 'Enter your password:'
        }]);
    const keyObject = JSON.parse(fs.readFileSync(path.join(KEYSTORE_PATH, response[`keystoreFile`])).toString());

    const spinner = ora().start('Generating private key');
    keythereum.recover(response[`password`], keyObject, ((privateKey) => {
        spinner.succeed('' +
            'Account: ' + Web3.utils.toChecksumAddress(keyObject[`address`]) +
            '\n  Private Key: ' + privateKey.toString('hex'));
    }));
})().catch((error) => {
    console.log('An error occurred');
    console.error(error.message);
});
