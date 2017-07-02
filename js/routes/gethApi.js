var express = require("express");
var router = express.Router();
var request = require('request');
var lightwallet = require('eth-lightwallet');

var constants = require('../constants/constants');
var web3Wrapper = require('../Web3Wrapper');
var keythereum = require("keythereum");
var HookedWeb3Provider = require("hooked-web3-provider");

router.get('/getBalance/:address', function (req, res) {
    let address = req.params.address;
    var balance = web3Wrapper.web3.eth.getBalance(address);
    // res.send([{ "name": "balance", "value": balance }]);

    res.send({
        "data": {"name":"balance","value":balance},
        "message": "success",
        "status":0,
        "errors": {
            "message":"",
            "code":0
        }
    });
});

router.get('/getTransctionCount/:address', function (req, res) {
    let address = req.params.address;
    var txCount = web3Wrapper.web3.eth.getTransactionCount(address);
    res.send([{ "name": "txCount", "value": txCount }]);
});

router.get('/peerCount', function (req, res) {
    var peerCount = web3Wrapper.web3.net.peerCount;
    res.send([
        { "name": "peerCount", "value": peerCount }
    ]);
});

router.get('/testLog', function (req, res) {
    console.log("testLog okay");
    res.send("testLog okay");
});

router.get('/defaultBlock', function (req, res) {
    let defaultBlock = web3Wrapper.web3.eth.defaultBlock;
    res.send([
        { "name": "defaultBlock", "value": defaultBlock }
    ])
});

router.get('/blockNumber', function (req, res) {
    let blockNumber = web3Wrapper.web3.eth.blockNumber;
    res.send([
        { "name": "blockNumber", "value": blockNumber }
    ])
});

router.get('/gasPrice', function (req, res) {
    let gasPrice = web3Wrapper.web3.eth.gasPrice;
    res.send([
        { "name": "gasPrice", "value": gasPrice }
    ]);
});

router.get('/getCode/:address', function (req, res) {
    let address = req.params.address;
    var code = web3Wrapper.web3.eth.getCode(address);
    res.send([
        { "name": "code", "value": code }
    ])
});

router.get('/getBlock/:blockNumber', function (req, res) {
    let blockNumber = req.params.blockNumber;
    var blockInfo = web3Wrapper.web3.eth.getBlock(blockNumber);
    res.send(blockInfo);
});


router.get('/getTransaction/:txHash', function (req, res) {
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
});

router.get('/ethlightwallet/test001', function (req, res) {
    //generate random seed
    var extraEntropy = "steve";
    var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
    console.log("randomSeed is: ", randomSeed);

    var password = "myPassword001";
    var global_keystore;
    lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {
        global_keystore = new lightwallet.keystore(randomSeed, pwDerivedKey);
        global_keystore.generateNewAddress(pwDerivedKey, 1);

        var addresses = global_keystore.getAddresses();
        console.log("addresses is: ", addresses);
        console.log("address0 is: ", addresses[0]);

        test001(global_keystore);
        res.send(global_keystore);
    })
});

router.get('/ethlightwallet/test002', function (req, res) {
    console.log("test002");
    var password = "myPassword001";

    lightwallet.keystore.createVault({ password: password }, function (err, ks) {
        console.log("ks is: ", ks);
        console.log("************************************************************************************************************************")
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
            if (err) throw err;
            console.log("pwDerivedKey is: ", pwDerivedKey);
            console.log("************************************************************************************************************************")

            ks.generateNewAddress(pwDerivedKey, 1);
            var address = ks.getAddresses();
            console.log("address is: ", address);
            test001(ks);
            console.log(web3Wrapper.web3.eth.accounts);
            res.send("test002 okay");
        })
    })
})

function test001(keystore) {
    // console.log(keystore);
    // console.log("test001");

    var web3Provider = new HookedWeb3Provider({
        host: "http://localhost:8545",
        transaction_signer: keystore
    });
    web3Wrapper.web3.setProvider(web3Provider);
};

router.get('/ethlightwallet/testSendTx', function (req, res) {
    var web3 = web3Wrapper.web3;
    console.log("testSendTx");
    var acc0 = "0xf416c1d6d127b81428660c4de66a486ba18f947d";
    var acc1 = "0x39c64224db74b0bcb10774a28ff03a3481482552";
    var amount = web3Wrapper.web3.toWei(0.001);

    console.log(acc0, acc1, amount);
    var balance = web3Wrapper.web3.eth.getBalance(acc0);
    console.log(web3Wrapper.web3.fromWei(balance));


    web3.eth.sendTransaction({
        from: acc1,
        to: acc0,
        value: amount
    }, function (err, txHash) {
        console.log('error: ' + err);
        console.log('txhash: ' + txHash);
        res.send(txHash);
    })
    // res.send("testSendTx okay");
});


var address0;
var address1;
router.get('/ethlightwallet/testSendTx02', function (req, res) {

    console.log("testSendTx02");
    var password = "myPassword001";

    lightwallet.keystore.createVault({ password: password }, function (err, ks) {
        // console.log("ks is: ",ks);
        // console.log("************************************************************************************************************************")
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
            if (err) throw err;
            // console.log("pwDerivedKey is: ",pwDerivedKey);
            // console.log("************************************************************************************************************************")

            ks.generateNewAddress(pwDerivedKey, 2);
            var addresses = ks.getAddresses();
            address0 = addresses[0];
            address1 = addresses[1];

            console.log("address0 is: ", address0);
            console.log("address1 is: ", address1);

            ks.passwordProvider = function (callback) {
                var pw = password;
                callback(null, pw);
            };

            var web3Provider = new HookedWeb3Provider({
                host: "http://localhost:8545",
                transaction_signer: ks
            });
            web3Wrapper.web3.setProvider(web3Provider);



            // web3Wrapper.web3.eth.sendTransaction({
            //     from: acc0,
            //     to: address0,
            //     value: amount
            // }, function (err, txHash) {
            //     console.log('error: ' + err);
            //     console.log('txhash: ' + txHash);
            // });

            // web3Wrapper.web3.eth.sendTransaction({
            //     from: acc0,
            //     to: address1,
            //     value: amount
            // }, function (err, txHash) {
            //     console.log('error: ' + err);
            //     console.log('txhash: ' + txHash);
            // });


        })
    })
    res.send("testSendTx02 okay");
})

router.get('/ethlightwallet/testSendTx03', function (req, res) {
    console.log("testSendTx03");
    var gasPrice = 50000000000;
    var gas = 300000;

    var amount = web3Wrapper.web3.toWei(0.1);
    web3Wrapper.web3.eth.sendTransaction({
                from: address0,
                to: address1,
                value: amount,
                gasPrice: gasPrice,
                gas: gas
            }, function (err, txHash) {
                console.log('error: ' + err);
                console.log('txhash: ' + txHash);
            });

    res.send("okay");
})









module.exports = router;