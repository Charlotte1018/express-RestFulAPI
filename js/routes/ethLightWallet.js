var express = require("express");
var router = express.Router();

var lightwallet = require('eth-lightwallet');

var web3Wrapper = require('../Web3Wrapper');
var HookedWeb3Provider = require("hooked-web3-provider");

router.get('/test001',function(req,res){
    console.log("test001");
    res.send("test001 okay");
});

router.post('/createKeyStore',function(req,res){
    let password = req.body.password;
    console.log("password is:",password);
    var address0;

    lightwallet.keystore.createVault({password:password},function(err,ks) {
        if (err) throw err;        
        
        ks.keyFromPassword(password, function (err, pwDerivedKey) { 
            if (err) throw err;
            //generate eth.address;
            ks.generateNewAddress(pwDerivedKey, 1);
            var addresses = ks.getAddresses();
            address0 = addresses[0];
            console.log("address0 is: ", address0);

            var web3Provider = new HookedWeb3Provider({
                host: "http://localhost:8545",
                transaction_signer: ks
            });
            web3Wrapper.web3.setProvider(web3Provider);

            res.send([
                {"status":"0"},
                {"address":address0},
                {"ks":ks}
            ]);
        });
    });    
});

router.post('/sendFakeTx',function(req,res){
    let from = req.body.from;
    let to = req.body.to;
    let value = req.body.value;
    let gasPrice = req.body.gasPrice;
    let gas = req.body.gas;

    res.send({
        "message": "success",
        "status":0,
        "errors": {
            "message":"",
            "code":0
        }
    });
})

router.post('/sendTx',function(req,res){
    let from = req.body.from;
    let to = req.body.to;
    let value = req.body.value;
    let gasPrice = req.body.gasPrice;
    let gas = req.body.gas;

    console.log(from);
    console.log(to);
    console.log(value);
    console.log(gasPrice);
    console.log(gas);
    res.send("okay");

    web3Wrapper.web3.eth.sendTransaction({
                from: from,
                to: to,
                value: value,
                gasPrice: gasPrice,
                gas: gas
            }, function (err, txHash) {
                if (err) throw err;
                console.log('error: ' + err);
                console.log('txhash: ' + txHash);
                res.send([
                    {"status":"0",
                    "error":"0",
                    "txHash":txHash}
                ]);
            });
});










module.exports = router;