

// npm start运行程序


var express = require('express');
var Web3 = require('web3');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');



var app = express();
var web3 = new Web3(new Web3.providers.HttpProvider("http://106.15.62.222:8545"));


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

app.get('/getBalance/:address',function(req,res){
	let address = req.params.address
    var balance = web3.eth.getBalance(address);
    res.send(balance)
})

//测试专用
app.get('/testContract',function(req,res){
    var p1Rate = myContractInst.p1Rate.call();
    console.log("p1Rate is: ",p1Rate);
    res.send(p1Rate);
})





// start icoStatus api
app.get('/icoStatus',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    var isFinalized = myContractInst.isFinalized.call();
    var isPreICO = myContractInst.isPreICO.call();
    var isHalted = myContractInst.isHalted.call();
    res.send([{ "name":"isFinalized","value": isFinalized },{ "name":"isPreICO","value": isPreICO },{ "name":"isHalted","value": isHalted }
    ])
})










/*
端口在http://localhost:3000
*/
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})