

// npm start运行程序
var web3Wrapper = require('./js/Web3Wrapper');
// web3Wrapper.initWeb3("http://106.15.62.222:8545");
web3Wrapper.initWeb3("http://localhost:8545");


var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var gethApi = require('./js/routes/gethApi');
var contractApi = require('./js/routes/contractApi');
var ethLightWallet = require('./js/routes/ethLightWallet');

var request = require('request');


var app = express();

var api = web3Wrapper.web3.version.api;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// 读取合约abi
var result = JSON.parse(fs.readFileSync(path.join(__dirname, 'VHToken.json')));

var abi = result.abi;


app.get('/abi', function (req, res, next) {
    res.send(result.abi);
});

app.get('/host', function (req, res) {
    res.send([{ "name": "1" },
    { "name": "2" }
    ]);
})


app.use('/gethAPI', gethApi);
app.use('/ethLightWallet',ethLightWallet);

app.use('/contractAPI', contractApi);

app.get('/geth', function (req, res) {
    res.send(api);
});

app.get('/stevenkcolin',function(req,res){
    res.send("hello world! stevenkcolin");
});

app.get('/currentProvider',function(req,res){
    var currentProvider = web3.currentProvider
    res.send( [{"currentProvider":currentProvider}])
});

/*
端口在http://localhost:3000
*/
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});