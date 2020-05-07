# Blockchain CS495
 1. [Setup Network](#setup-network)
 2. [Quorum Geth](#install-quorum-geth)
 3. [Tools](#tools)
	3.1 [Unlock Account](#unlock-account)
	3.2 [Generate Private Key](#generate-private-key)
	3.3 [Deploy Contract](#deploy-contract)
3. [Using Remix IDE](#using-remix-ide)


## Setup Network
Install [Docker Compose](https://docs.docker.com/compose/).
``` bash
sudo apt install docker-compose
``` 
Clone the [Quorum Maker](https://github.com/synechron-finlabs/quorum-maker) repository.
``` bash
git clone https://github.com/synechron-finlabs/quorum-maker.git
```
Enter the directory and start the `setup.sh` file
``` bash
cd quorum-maker/
./setup.sh
```
Select option **4) Setup Development/Test Network** and optionally give the network a name, if not just continue with `TestNetwork`. The same applies for number of nodes. It is recommended to have at least **3** nodes to assure the consensus is working correctly. 
Start up the containers and virtual network.
``` bash
cd TestNetwork
docker-compose up
```
After successful creation the node manager for *node 1* should be available under [http://10.50.0.2:22004/](http://10.50.0.2:22004/)
For more information check out the [Quorum Maker Wiki](https://github.com/synechron-finlabs/quorum-maker/wiki).

## Install [Quorum Geth](https://github.com/jpmorganchase/quorum)
Description of how Geth should be installed on a system. 
:information_source: The latest version of Quorum is used.
1. Installing [Go](https://github.com/golang/go):
 ```bash
 sudo apt install golang
 ```
2. Clone the Quorum from GitHub:
 ```bash
 git clone https://github.com/jpmorganchase/quorum
 cd quorum
 ```
3.  Make Quorum:
 ```bash
 make
 ```
4.  Add Geth to PATH:
 ```bash
 PATH=$PATH:build/bin/
 ```
5. Check if installation was successful:
 ```bash
 geth version
 ```
 With something similar to this output:
 ```bash
 Geth
 Version: 1.8.18-stable
 Git Commit: 85e22579951107af91fce755be536942a76e34d1
 Quorum Version: 2.4.0
 Architecture: amd64
 Protocol Versions: [63 62]
 Network Id: 1337
 Go Version: go1.10.4
 Operating System: linux
 GOPATH=
 GOROOT=/usr/lib/go-1.10
 ```
## Tools
Before running any of the tools execute the command 
``` bash
npm install
```
Should there be an issue with installing all the dependencies make sure to run on Node **v10.16.3** and NPM **6.9.0**.
### Unlock Account
The gives a guided workflow of unlocking an account. In order to add an account follow the [Geth](https://github.com/jpmorganchase/quorum) instructions. 
Run `node UnlockAccount.js`.
Note: If the network is setup with Quorum Maker, node 1 RPC URL is `http://10.50.0.2:22000`.
### Generate Private Key
The key files can be found in the Keystore directory of every node. If the setup was followed the keys for *node 1* are located at `/quorum-maker/TestNetwork/node1/node/qdata/keystore`.
If created via [Geth](https://github.com/jpmorganchase/quorum), the name of the Keystore file is usually a combination between creation timestamp and account address. For example: 
`UTC--2020-05-06T20-59-57.294663669Z--10df2d712531a283cac41d48250eb86a903a7f26`
They usually follow this layout:
``` JSON
{
	"address":"10df2d712531a283cac41d48250eb86a903a7f26",
	"crypto":
		{
			"cipher":"aes-128-ctr",
			"ciphertext":"eb9dbf1c0690ff4b35886a379d37c4f6b86053f3c52fc495ad5edd517563ea0c",
			"cipherparams":
				{
					"iv":"2a5a19415f1876f6fabeb9a5e4c0fc46"
				},
			"kdf":"scrypt",
			"kdfparams":
				{
					"dklen":32,
					"n":262144,
					"p":1,
					"r":8,
					"salt":"b7b08efb8a626b072dda5785f2a9151ce45d5712ab536026325ce1ea6d107a0c"
				},
			"mac":"48999f354b3c528919ea1179512a7b589665c826009cdffc63631996d1d19cd3"
		},
	"id":"474a26a3-ba32-4d21-bfaf-7052d29dde69",
	"version":3
}
```
Run `node PrivateKeyGenerator.js` and the menu should be able to guide you through the process to retrieve the private Key.
### Deploy Contract
The sample contract given:
```
pragma solidity ^0.5.0;

contract Simple {
    int256 value; 
    constructor(int256 _value)  public{
        value = _value;
    }
    function set(int256 _value) public{
        value = _value;
    }
    function get() public view returns (int256){
        return value;
    }
}
```
In the config file in `./assets/config.json` simply add the ABI and Bytecode which can be copied from Remix. Where to find this information can be found below. After replacing it in the config file. Simply run `node DeployContract.js` and follow the instructions. The private key can be retrieved via the [Generate Private Key](#generate-private-key) tool.
## Connecting Remix IDE
For testing purposes, [Remix](https://remix.ethereum.org) provides a really helpful IDE. When selecting the way to connect to the Blockchain choose Web3 Provider from the drop down. Enter the full URL into the windows shown.

Should you not have enabled HTTPS on you node, make sure to go to the insecure version of [Remix](http://remix.ethereum.org), too.
