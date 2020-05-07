'use strict';
const Web3 = require('web3');
const ora = require('ora');
const prompt  = require('prompts');
const fs = require('fs');

const CONFIG_PATH = './assets/config.json';

const config = JSON.parse(fs.readFileSync(CONFIG_PATH).toString());

(async () => {
    let response = await prompt({
        type: 'text',
        name: 'provider',
        message: 'The provider URL of your RPC Node:',
        initial: config[`account`][`providerAddress`]
    });
    const web3 = new Web3(response[`provider`].toString());
    const accounts = await web3.eth.personal.getAccounts();
    response = await prompt([{
            type: 'select',
            name: 'account',
            message: 'Choose your Account:',
            choices: accounts.map(account => Object({title: account, value: account})),
            initial: accounts.indexOf(config[`account`][`address`]) > 0 ? accounts.indexOf(config[`account`][`address`]) : 0
    },{
            type: 'text',
            name: 'password',
            message: 'Enter your password:',
            initial: config[`account`][`password`]
    },{
        type: 'number',
        name: 'duration',
        message: 'Enter duration of unlock in seconds:',
        initial: config.duration ? config.duration : ''
    }]);
    const spinner = ora().start("Unlocking Account");
    web3.eth.personal.unlockAccount(
        response[`account`],
        response[`password`],
        response[`duration`]).then(async () => {
            spinner.succeed("Account is unlocked");
            const data = response;
            response = await prompt({
                type: 'confirm',
                name: 'store',
                message: 'Do you want to store the credentials',
            });
            if (response[`store`]) {
                config[`account`][`address`] = data[`account`];
                config[`account`][`password`] = data[`password`];
                config[`account`][`providerAddress`] = web3.eth.currentProvider.host;
                fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
            }
    }).catch(() => {
        spinner.fail('Could not unlock account');
    });
})().catch((error) => {
        console.log('An error occurred');
        console.error(error.message);
});
