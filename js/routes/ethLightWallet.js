var express = require("express");
var router = express.Router();

var lightwallet = require('eth-lightwallet');

var web3Wrapper = require('../Web3Wrapper');
var HookedWeb3Provider = require("hooked-web3-provider");

router.post('/createKeyStore',function(req,res){
    let password = req.body.password;
    console.log("password is:",password);
    var address0;

    lightwallet.keystore.createVault({password:password},function(err,ks) {
        if (err) throw err;        
        
        ks.keyFromPassword(password, function (err, pwDerivedKey) { 
            if (err) throw err;
            //generate eth.address;
            ks.generateNewAddress(pwDerivedKey, 3);
            var addresses = ks.getAddresses();
            console.log("address0 is: ", addresses);

            ks.passwordProvider = function (callback) {
            var pw = password
                callback(null, pw);
            };

            var web3Provider = new HookedWeb3Provider({
                host: "http://localhost:8545",
                transaction_signer: ks
            });
            web3Wrapper.web3.setProvider(web3Provider);

            res.send([
                {"status":"0"},
                {"address":addresses},
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

router.post('/createV3',function(req,res){
    let password = req.body.password;

    var tWallet = Wallet.generate(false);
    var wStr = tWallet.toV3(password,{
        kdf:globalFuncs.kdf,
        n:globalFuncs.scrypt.n
    });
    var strjson = JSON.stringify(wStr);
    var address = tWallet.getAddressString();
    var publicKey = tWallet.getPublicKeyString();
    console.log("publicKey is: ",publicKey);
    var json = tWallet.toJSON();
    console.log("json:",json);
    

    res.send({"strjson":strjson,"address":address});
});

router.post('/importWallet',function(req,res){
    let password = req.body.password;
    let strjson = req.body.strjson;

    var tWallet = Wallet.getWalletFromPrivKeyFile(strjson,password);
    console.log(tWallet);

    res.send({"wallet":tWallet});
})

router.post('/importWalletFile',function(req,res){
    let body = req.body;    
    console.log(body);

    let strjson = JSON.stringify(body);
    console.log(strjson);
    res.send({"strjson":strjson});
})




router.post('/fromV3',function(req,res){
    let password = req.body.password;
    let strjson = req.body.strjson;
    console.log("password: ",password);
    console.log("strjson: ",strjson);

    var v3Wallet = Wallet.fromV3(strjson,password,true);
    console.log(v3Wallet);

    res.send({"wallet":v3Wallet});
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

router.post('/test002',function(req,res){
    console.log("hello world test002");
    console.log(privateKey);

    var tx = new EthereumTx(txParams);
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    console.log(serializedTx);

    // var balance = web3Wrapper.web3.eth.getBalance("0x7af5407febc9b8a511adf40499ba4662833e6dc1");
    // console.log(balance);

    web3Wrapper.web3.eth.sendRawTransaction(serializedTx.toString(), function(err, hash) {
        console.log(err);
        console.log(hash);
    });

    res.send("okay")
});


router.post('/test003',function(req,res){
    console.log("hello test003");

    var from = "0x573f7b10e143889128EE57433B051101Ee87cF88";
    var to = "0xef3AC99B576909852D8470b219Ef1F0118b05aFc";
    var value = "100000000000000";
    var nonce = '100';
    var gasLimit = 100000;
    var gasPrice = 20000000000;
                   

    // web3Wrapper.web3.eth.sendTransaction({
    //             from: from,
    //             to: to,
    //             value: value
    //         }, function (err, txHash) {
    //             console.log('error: ' + err);
    //             console.log('txhash: ' + txHash);
    //             res.send("okay");
    //         });

    var Tx = require('ethereumjs-tx');
    var privateKey = Buffer.from('ec66a2866f4b93f6a02a9e53c7345eb5ba7d15ac4fa7caf0ab4a8f0b6c4e3efa', 'hex');
    var rawTx = {
        chainId : 1,
        nonce: "0x42",
        from: from,
        to: to,
        value: "0x5af3107a4000",
        gasLimit: "0x5208",
        gasPrice : "0x04e3b29200"
    };

    var balance = web3Wrapper.web3.eth.getBalance(from);
    console.log(balance);

    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();
    // rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
    web3Wrapper.web3.eth.sendRawTransaction('0x'+serializedTx.toString('hex'), function(err, hash){
        console.log(err);
        console.log(hash);
    });

    res.send("okay");
})








module.exports = router;