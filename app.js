

// npm start运行程序


var express = require('express');
var Web3 = require('web3');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var etherScanApiToken = "AJKFV8KK6H6C5JRMCN4YMM9VW5AX2485JY";
var keythereum = require("keythereum");

var app = express();
// var web3 = new Web3(new Web3.providers.HttpProvider("http://106.15.62.222:8545"));
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var api = web3.version.api;
var contractAddress = "0x046A6FF757C8EdAA91Dd886Df8B60C217d99f11b";
// 读取合约abi
var result = JSON.parse(fs.readFileSync(path.join(__dirname, 'VHToken.json')));

var abi = result.abi;
var myContract = web3.eth.contract(abi);
var myContractInst = myContract.at(contractAddress);

app.get('/abi', function (req, res, next) {
    res.send(result.abi);
});

app.get('/host', function (req, res) {
    res.send([{ "name": "1" },
    { "name": "2" }
    ]);
})
app.get('/geth', function (req, res) {
    res.send(api);
})

app.get('/stevenkcolin',function(req,res){
    res.send("hello world! stevenkcolin");
})

app.get('/currentProvider',function(req,res){
    var currentProvider = web3.currentProvider
    res.send( [{"currentProvider":currentProvider}])
})

app.get('/gethApi/getBalance/:address',function(req,res){
	let address = req.params.address
    var balance = web3.eth.getBalance(address);
    res.send([{"name":"balance","value":balance}]);
})

app.get('/gethApi/getTransctionCount/:address',function(req,res){
    let address = req.params.address;
    var txCount = web3.eth.getTransactionCount(address);
    res.send([{"name":"txCount","value":txCount}]);
})

app.get('/gethApi/peerCount',function(req,res){
    var peerCount = web3.net.peerCount;
    res.send([
        {"name":"peerCount","value":peerCount}
    ]);
})

app.get('/gethApi/testLog',function(req,res){
    console.log("testLog okay");
    res.send("testLog okay");
})

app.get('/gethApi/defaultBlock',function(req,res){
    let defaultBlock = web3.eth.defaultBlock;
    res.send([
        {"name":"defaultBlock","value":defaultBlock}
    ])
})

app.get('/gethApi/blockNumber',function(req,res){
    let blockNumber = web3.eth.blockNumber;
    res.send([
        {"name":"blockNumber","value":blockNumber}
    ])
})

app.get('/gethApi/gasPrice',function(req,res){
    let gasPrice = web3.eth.gasPrice;
    res.send([
        {"name":"gasPrice","value":gasPrice}
    ]);
})

app.get('/gethApi/getCode/:address',function(req,res){
    let address = req.params.address;
    var code = web3.eth.getCode(address);
    res.send([
        {"name":"code","value":code}
    ])
})

app.get('/gethApi/getBlock/:blockNumber',function(req,res){
    let blockNumber = req.params.blockNumber;
    var blockInfo = web3.eth.getBlock(blockNumber);
    res.send(blockInfo);
})


app.get('/gethApi/getTransaction/:txHash',function(req,res){
    let txHash = req.params.txHash;
    var aaa; 
    // https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=0x1e2910a262b1008d0616a0beb24c1a491d78771baa54a33e66065e03b1f46bc1&apikey=AJKFV8KK6H6C5JRMCN4YMM9VW5AX2485JY
    res.send(aaa) 
})


app.get('/gethApi/testForKey',function(req,res){
    

    var params = { keyBytes: 32, ivBytes: 16 };
    
    keythereum.create(params,function(dk){
        var aaa = dk;
        res.send(aaa);
    })
})








// start icoStatus api
app.get('/contractAPI/icoStatus',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    var isFinalized = myContractInst.isFinalized.call();
    var isPreICO = myContractInst.isPreICO.call();
    var isHalted = myContractInst.isHalted.call();
    res.send([{ "name":"isFinalized","value": isFinalized },{ "name":"isPreICO","value": isPreICO },{ "name":"isHalted","value": isHalted }
    ])
})


app.get('/contractAPI/tokenInfo',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");

    var name = myContractInst.name.call();
    var symbol = myContractInst.symbol.call();
    var currentBalance = web3.eth.getBalance(contractAddress);

    var p0Rate = myContractInst.p0Rate.call();
    var p1Rate = myContractInst.p1Rate.call();
    var p2Rate = myContractInst.p2Rate.call();
    var p3Rate = myContractInst.p3Rate.call();
    var currRate = myContractInst.currRate.call();

    res.send([{"name":"p0Rate","value":p0Rate},
    {"name":"p1Rate","value":p1Rate},
    {"name":"p2Rate","value":p2Rate},
    {"name":"p3Rate","value":p3Rate},
    {"name":"currRate","value":currRate},

    {"name":"name","value":name},
    {"name":"symbol","value":symbol},
    {"name":"currentBalance","value":currentBalance}
    ]);
})

app.get('/contractAPI/blockInfo',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    var currentBlockNumber = web3.eth.blockNumber;
    var fundingStartBlock = myContractInst.fundingStartBlock.call();
    var fundingEndBlock = myContractInst.fundingEndBlock.call();
    var fundingP2Block = myContractInst.fundingP2Block.call();
    var fundingP3Block = myContractInst.fundingP3Block.call();

    res.send([{"name":"currentBlockNumber","value":currentBlockNumber},
    {"name":"fundingStartBlock","value":fundingStartBlock},
    {"name":"fundingEndBlock","value":fundingEndBlock},
    {"name":"fundingP2Block","value":fundingP2Block},
    {"name":"fundingP3Block","value":fundingP3Block}    
    ]);
})

app.get('/contractAPI/accountInfo',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");

    var vhPreIcoAmount = web3.fromWei(myContractInst.vhPreIcoAmount.call());
    var vhIcoAmount = web3.fromWei(myContractInst.vhIcoAmount.call());
    var vhAllocatedAmount = web3.fromWei(myContractInst.vhAllocatedAmount.call());
    var vhICOCap = web3.fromWei(myContractInst.vhICOCap.call());

    var preICO_VenheAcc = myContractInst.preICO_VenheAcc.call();
    var ico_VenheAcc = myContractInst.ico_VenheAcc.call();
    var allocated_venheAcc = myContractInst.allocated_venheAcc.call();
    var ethAcc = myContractInst.ethAcc.call();


    res.send([{"name":"vhPreIcoAmount","value":vhPreIcoAmount},
    {"name":"vhIcoAmount","value":vhIcoAmount},
    {"name":"vhAllocatedAmount","value":vhAllocatedAmount},
    {"name":"vhICOCap","value":vhICOCap},

    {"name":"preICO_VenheAcc","value":preICO_VenheAcc},
    {"name":"ico_VenheAcc","value":ico_VenheAcc},
    {"name":"allocated_venheAcc","value":allocated_venheAcc},
    {"name":"ethAcc","value":ethAcc}
    
    ]);
});


//test function for post method
//test json is
// {
// 	"gasLimit": 300000,
// 	"gasValue" : 20,
// 	"amount" : 14000000000
// }
app.post('/contractAPI/aaa', function(req, res){
    // console.log(req.body);
    let gasLimit = req.body.gasLimit;
    let gasValue = req.body.gasValue;
    let amount = req.body.amount;
    console.log("gasLimit is: ",gasLimit);
    console.log("gasValue is: ",gasValue);
    console.log("amount is: ",amount);

    res.send("okay");
});


/*
端口在http://localhost:3000
*/
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})