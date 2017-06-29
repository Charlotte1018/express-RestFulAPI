

// npm start运行程序


var express = require('express');
var Web3 = require('web3');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');



var app = express();
var web3 = new Web3(new Web3.providers.HttpProvider("http:/localhost:8545"));


var api = web3.version.api;
var contractAddress = "0x046A6FF757C8EdAA91Dd886Df8B60C217d99f11b";
console.log(contractAddress);

// 读取合约abi
var result = JSON.parse(fs.readFileSync(path.join(__dirname, 'VHToken.json')));

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
/*
端口在http://localhost:3000
*/
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
})