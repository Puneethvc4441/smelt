const {web3, networkId} = require('./web3Helpers');
const {sm3ltContract} = require('../tokenInstance');
const { ethers } = require("ethers");

exports.tokenGetMethod =  async (req, res) => {
    try{
        console.log(req.body);
        const method = req.body.method; 

        let tokenInstance = sm3ltContract;
        const resss= await tokenInstance.methods.name().call()
        console.log({resss})
        let result;   
        // console.log(tokenInstance.methods);  
        if(method == "symbol") {
            result = await tokenInstance.methods.symbol().call();
        } else if(method == "name") {
            result = await tokenInstance._methods.name().call();
            console.log(result)
        } else if(method == "decimals") {
            result = await tokenInstance.methods.decimals().call();
        } else if(method == "totalSupply") {
            result = await tokenInstance.methods.totalSupply().call();
            result = await web3.utils.fromWei(result, 'ether');
        } else if(method == "allowance") {
            result = await tokenInstance.methods.allowance(req.body.owner, req.body.spender).call();
            result = await web3.utils.fromWei(result, 'ether');
        } else if(method == "balanceOf") {
            result = await tokenInstance.methods.balanceOf(req.body.owner).call();
            result = await web3.utils.toWei(result, 'ether');
        }
        res.status(200).json({data: result, error: null});
    } catch (error) {
        res.status(400).json({data: null, error: error.toString()});
    }
}

exports.tokenBalance =  async (req, res) => {
    try{
        
        const address = req.body.address;
        let tokenInstance = sm3ltContract;
        // get balance of owner
        let sm3ltBalance = await tokenInstance.methods.balanceOf(address).call();
        // convert to ether
        sm3ltBalance = await web3.utils.fromWei(sm3ltBalance, 'ether');
        sm3ltBalance = parseFloat(sm3ltBalance).toFixed(4);
        res.status(200).json({data: {sm3ltBalance:sm3ltBalance}, error: null});
       
    } catch(e) {
        console.log(e);
        res.json({data: null, error: e.toString()});
    }
}


exports.tokenSetMethod =  async (req, res) => {
        try{
        
            let from = req.body.from;
            let to = req.body.to;
            let amount = req.body.amount;
            let method = req.body.method;

            let tokenInstance =sm3ltContract;
    
            amount = web3.utils.toWei(amount, 'ether');
            
            let txObj;
        
            if(method == "transfer") {
                txObj = tokenInstance.methods.transfer(to,amount);
                
            } else if(method == "approve") {
            
                txObj = tokenInstance.methods.approve(to,amount);
                
            } else if(method == "mint") {
                txObj = tokenInstance.methods.mint(to,amount);
            // console.log(txObj);
            }
            
            const gas = await txObj.estimateGas({ from });
            const gasPrice = await web3.eth.getGasPrice();
            const gasFee = gas * gasPrice;
            // const gasFee = await estimateGasFee(txObj, from);
            // check if sender has token balance
            
            const tokenBalance = await tokenInstance.methods.balanceOf(from).call();
            //check if the sender has enough ether to pay gas fee
            const senderEthBalance = await web3.eth.getBalance(from);
            const nonce = await web3.eth.getTransactionCount(from);

            if(parseInt(tokenBalance) < parseInt(amount) && method != "mint") {
                res.json({error: "Insufficient token balance", response: null});
            } else if(parseInt(senderEthBalance) < parseInt(gasFee)) {
                res.json({error: "Insufficient balance to pay gas fee", response: null});
            } else {
                const data = txObj.encodeABI(); 
                const txObj1 = {
                    to: tokenInstance.options.address,
                    data,  
                    gas,
                    gasPrice,
                    nonce,
                    chainId: networkId
                }
                console.log("check")
            let pk = process.env.PK;
            if(pk != null){
                const signature = await web3.eth.accounts.signTransaction(txObj1, pk);
                
                let receipt = await web3.eth.sendSignedTransaction(signature.rawTransaction) 
                
                res.json({data: receipt.transactionHash , error: null});
            }else {
                res.status(402).json({data:null, error:"invalid privatekey"})
            }
        }
        }catch(e){
            console.log(e);
            res.json({error: e.toString(), data: null});
        }
    }




