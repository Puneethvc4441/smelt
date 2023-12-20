const {Web3} = require('web3');
const ethers = require('ethers');
const dotenv = require("dotenv");
// const { isValidMnemonic } = require ('@ethersproject/hdnode');
dotenv.config();
let web3;
let networkId; 
if(process.env.MAINNET ==  "false"  ) {
    web3 = new Web3('https://rpc-mumbai.maticvigil.com/');
    networkId = 80001;
} else {
    web3 = new Web3('https://rpc-mainnet.maticvigil.com/');
    networkId = 137;
}

module.exports = {web3}