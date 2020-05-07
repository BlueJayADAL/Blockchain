'use strict';
const Web3 = require('web3');
const ora = require('ora');
const prompt  = require('prompts');
const fs = require('fs');

const CONFIG_PATH = './assets/config.json';

const config = JSON.parse(fs.readFileSync(CONFIG_PATH).toString());

console.log('Make sure to change the config file ABI and Bytecode to the contract that you want to deploy.');

(async () => {
    let response = await prompt({
        type: 'text',
        name: 'provider',
        message: 'The provider URL of your RPC Node:',
    });
    const web3 = new Web3(response[`provider`]);
    const accounts = await web3.eth.personal.getAccounts();
    response = await prompt([{
        type: 'select',
        name: 'account',
        message: 'Choose your Account:',
        choices: accounts.map(account => Object({title: account, value: account}))
    },{
        type: 'text',
        name: 'privateKey',
        message: 'Enter your private key:',
    }]);

    const accountNonce = await web3.eth.getTransactionCount(response[`account`]);
    const chainID = await web3.eth.net.getId();
    const contract = new web3.eth.Contract(config[`contract`][`abi`]);
    const deployData = contract.deploy({
        data: '0x' + config[`contract`][`bytecode`][`object`],
        arguments: [42]
    }).encodeABI();
    const transaction = {
        data: deployData,
        gasPrice: '0',
        gas: 0x17D7840,
        nonce: accountNonce.toString(),
        chainId: chainID.toString()
    };
    const spinner = ora().start('Deploying contract');
    web3.eth.accounts.signTransaction(transaction, response[`privateKey`]).then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction).on(('receipt'), (receipt) => {
            spinner.succeed('Contract deployed at ' + receipt[`contractAddress`]);
        })
    }).catch((error) => {
        spinner.fail('Could not deploy contract');
        console.error(error.message);
    });
})();
