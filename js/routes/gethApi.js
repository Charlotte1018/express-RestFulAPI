var express = require("express");
var router = express.Router();
var request = require('request');

var constants = require('../constants/constants');
var web3Wrapper = require('../Web3Wrapper');
var keythereum = require("keythereum");

router.get('/getBalance/:address',function(req,res){
    let address = req.params.address;
    var balance = web3Wrapper.web3.eth.getBalance(address);
    res.send([{"name":"balance","value":balance}]);
});

router.get('/getTransctionCount/:address',function(req,res){
    let address = req.params.address;
    var txCount = web3Wrapper.web3.eth.getTransactionCount(address);
    res.send([{"name":"txCount","value":txCount}]);
});

router.get('/peerCount',function(req,res){
    var peerCount = web3Wrapper.web3.net.peerCount;
    res.send([
        {"name":"peerCount","value":peerCount}
    ]);
});

router.get('/testLog',function(req,res){
    console.log("testLog okay");
    res.send("testLog okay");
});

router.get('/defaultBlock',function(req,res){
    let defaultBlock = web3Wrapper.web3.eth.defaultBlock;
    res.send([
        {"name":"defaultBlock","value":defaultBlock}
    ])
});

router.get('/blockNumber',function(req,res){
    let blockNumber = web3Wrapper.web3.eth.blockNumber;
    res.send([
        {"name":"blockNumber","value":blockNumber}
    ])
});

router.get('/gasPrice',function(req,res){
    let gasPrice = web3Wrapper.web3.eth.gasPrice;
    res.send([
        {"name":"gasPrice","value":gasPrice}
    ]);
});

router.get('/getCode/:address',function(req,res){
    let address = req.params.address;
    var code = web3Wrapper.web3.eth.getCode(address);
    res.send([
        {"name":"code","value":code}
    ])
});

router.get('/getBlock/:blockNumber',function(req,res){
    let blockNumber = req.params.blockNumber;
    var blockInfo = web3Wrapper.web3.eth.getBlock(blockNumber);
    res.send(blockInfo);
});


router.get('/getTransaction/:txHash',function(req,res){
    let txHash = req.params.txHash;
    let etherScanApiToken = constants.etherScanApiToken;
    let url = 'https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=' + txHash + '&apikey=' + etherScanApiToken;
    request(url, function (error, res1) {
        var obj = JSON.parse(res1.body);
        res.send(obj);
    })
});

router.get('/keyexport/:password', function (req, res) {
    let password = req.params.password;

    var params = { keyBytes: 32, ivBytes: 16 };
    var dk = keythereum.create(params);

    var kdf = "pbkdf2";
    var options = {
        kdf: "pbkdf2",
        cipher: "aes-128-ctr",
        kdfparams: {
            c: 262144,
            dklen: 32,
            prf: "hmac-sha256"
        }
    };

    var keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options);
    res.send(keyObject);
})




module.exports = router;