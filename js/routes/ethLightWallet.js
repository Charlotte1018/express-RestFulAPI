var express = require("express");
var router = express.Router();

var lightwallet = require('eth-lightwallet');

var web3Wrapper = require('../Web3Wrapper');
var HookedWeb3Provider = require("hooked-web3-provider");

router.post('/sendFakeTx', function (req, res) {
    let from = req.body.from;
    let to = req.body.to;
    let value = req.body.value;
    let gasPrice = req.body.gasPrice;
    let gas = req.body.gas;

    res.send({
        "message": "success",
        "status": 0,
        "errors": {
            "message": "",
            "code": 0
        }
    });
})

router.post('/sendTx', function (req, res) {
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


    web3Wrapper.web3.eth.sendTransaction({
        from: from,
        to: to,
        value: value,
        gasPrice: gasPrice,
        gas: gas
    }, function (err, txHash) {
        console.log('error: ' + err);
        console.log('txhash: ' + txHash);
        res.send("okay");
    });
});

//已完工，实现了 @2017/07/15
router.post('/createV3', function (req, res) {
    let password = req.body.password;

    var tWallet = Wallet.generate(false);
    var wStr = tWallet.toV3(password, {
        kdf: globalFuncs.kdf,
        n: globalFuncs.scrypt.n
    });
    var strjson = JSON.stringify(wStr);
    var address = tWallet.getAddressString();
    var publicKey = tWallet.getPublicKeyString();
    var json = tWallet.toJSON();

    res.send({ "strjson": strjson, "address": address ,"status":0, "message":"success"});
});

// 已完工 @2017/07/15
router.post('/importWallet', function (req, res) {
    let password = req.body.password;
    let strjson = req.body.strjson;

    var tWallet = Wallet.getWalletFromPrivKeyFile(strjson, password);
    res.send({ "wallet": tWallet ,"status":0, "message":"success"});
})

// 已完工 @2017/07/15
router.post('/importWalletFile', function (req, res) {
    let body = req.body;
    let strjson = JSON.stringify(body);
    res.send({ "strjson": strjson,"status":0, "message":"success"});
})

//已完工 @2017/07/15
router.post('/fromV3', function (req, res) {
    let password = req.body.password;
    let strjson = req.body.strjson;

    var v3Wallet = Wallet.fromV3(strjson, password, true);
    res.send({ "wallet": v3Wallet,"status":0, "message":"success"});
});


const EthereumTx = require('ethereumjs-tx');
const privateKey = Buffer.from('8b6b36a33897afca6111c52d8075b4e5038065c4d12a610fc43de2e87cf3f53f', 'hex')

const txParams = {
    nonce: '0x00',
    gasPrice: '0x09184e72a000',
    gasLimit: '0x2710',
    from: '0x7af5407febc9b8a511adf40499ba4662833e6dc1',
    to: '0x0a3264926aa54756a92d84622599fc8fbd407320',
    value: '10000000000000000'
}

router.post('/test002', function (req, res) {
    console.log("hello world test002");
    console.log(privateKey);

    var tx = new EthereumTx(txParams);
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    console.log(serializedTx);

    // var balance = web3Wrapper.web3.eth.getBalance("0x7af5407febc9b8a511adf40499ba4662833e6dc1");
    // console.log(balance);

    web3Wrapper.web3.eth.sendRawTransaction(serializedTx.toString(), function (err, hash) {
        console.log(err);
        console.log(hash);
    });

    res.send("okay")
});


router.post('/test003', function (req, res) {
    console.log("hello test003");

    var from = "0x573f7b10e143889128EE57433B051101Ee87cF88";
    var to = "0xef3AC99B576909852D8470b219Ef1F0118b05aFc";
    var value = "100000000000000";
    var nonce = '100';
    var gasLimit = 100000;
    var gasPrice = 20000000000;


    var Tx = require('ethereumjs-tx');
    var privateKey = Buffer.from('ec66a2866f4b93f6a02a9e53c7345eb5ba7d15ac4fa7caf0ab4a8f0b6c4e3efa', 'hex');
    console.log("privateKey is: ", privateKey);
    // var rawTx = {
    //     chainId:1,
    //     nonce:"0x97",
    //     from:from,
    //     to: to,
    //     value: "0x5af3107a4000",
    //     gasLimit: "0x5208",
    //     gasPrice : "0x04e3b29200"
    // };

    var rawTx =
        {
            "nonce": "0x4c",
            "gasPrice": "0x04e3b29200",
            "gasLimit": "0x5208",
            "to": "0xef3AC99B576909852D8470b219Ef1F0118b05aFc",
            "value": "0x5af3107a4000",
            "data": "",
            "chainId": 1
        };

    // var jsonRawTx = JSON.stringify(rawTx);
    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = '0x' + tx.serialize().toString('hex');



    // web3Wrapper.web3.eth.sendRawTransaction("0xf86a4a8504e3b2920082520894ef3ac99b576909852d8470b219ef1f0118b05afc865af3107a40008025a0961af3c5d681a9b80d23fde96310b30f0e430f080c1bb12fe1d7c29ccbc41d9ea01ab31b6d324ba373a9822fb35c93b2caabf419db01e823d76318154cf8a9c3ad", function(err, hash){
    //     console.log(err);
    //     console.log(hash);

    // });


    console.log(serializedTx);
    res.send({ "serializedTx": serializedTx });
});

router.post('/test004', function (req, res) {
    console.log("hello test004");

    var Tx = require('ethereumjs-tx');
    var privateKey = Buffer.from('299eae76997c77adee26de25b0a3ddc332d279799a0cc05d97823fe1a943ca78', 'hex');
    var from = "0xa075938e3af91b0988b7de2e5333416ebebe6c9f";
    var to = "0x573f7b10e143889128ee57433b051101ee87cf88";

    var rawTx = {
        chainId: "1",
        nonce: "0x90",
        from: "0xa075938e3af91b0988b7de2e5333416ebebe6c9f",
        to: "0x573f7b10e143889128ee57433b051101ee87cf88",
        value: "0x5af3107a4000",
        gasLimit: "0x5208",
        gasPrice: "0x04e3b29200"
    };

    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();

    web3Wrapper.web3.eth.sendRawTransaction("0x" + serializedTx.toString('hex'), function (err, hash) {
        console.log(err);
        console.log(hash);

        console.log(web3Wrapper.web3.eth.getBalance(from));
        console.log(web3Wrapper.web3.eth.getBalance(to));
    });
    res.send("test004 okay");
});

router.post('/test005', function (req, res) {
    console.log("hello test005");
    var request = require('request');

    var from = "0x573f7b10e143889128EE57433B051101Ee87cF88";
    var to = "0xef3AC99B576909852D8470b219Ef1F0118b05aFc";

    var Tx = require('ethereumjs-tx');
    var privateKey = Buffer.from('ec66a2866f4b93f6a02a9e53c7345eb5ba7d15ac4fa7caf0ab4a8f0b6c4e3efa', 'hex');

    let url = "https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=0x573f7b10e143889128EE57433B051101Ee87cF88&tag=latest&apikey=AJKFV8KK6H6C5JRMCN4YMM9VW5AX2485JY";

    var nonce;
    request(url, function (error, res1) {
        if (error) {res.send(error); return}
        let body = JSON.parse(res1.body);
        nonce = parseInt(body.result);
        console.log("nonce is: ", nonce);

        var rawTx =
            {
                "nonce": nonce,
                "gasPrice": "0x04e3b29200",
                "gasLimit": "0x5208",
                "to": "0xef3AC99B576909852D8470b219Ef1F0118b05aFc",
                "value": "0x5af3107a4000",
                "data": "",
                "chainId": 1
            };

        var tx = new Tx(rawTx);
        tx.sign(privateKey);
        var serializedTx = '0x' + tx.serialize().toString('hex');
        console.log("serializedTx is: ", serializedTx);

        let postUrl = "https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex="+serializedTx+"&apikey=AJKFV8KK6H6C5JRMCN4YMM9VW5AX2485JY"

        console.log(postUrl);
        // res.send("okay");
        request.post(postUrl,function(error,res1){
            let body = JSON.parse(res1.body);
            let hash = body.result;
            console.log("hash is: ",hash);
            res.send({ "serializedTx": serializedTx,"hash":hash});
        });
    });
});








module.exports = router;