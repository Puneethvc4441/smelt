const {web3} = require('./helpers/web3Helpers');
const sm3ltToken = require('../contracts/abis/sm3ltToken.json');

 
// create sm3ltToken contract instance
const sm3ltContract = new web3.eth.Contract(sm3ltToken.abi, sm3ltToken.address);

module.exports = {sm3ltContract}

