

// npm start运行程序
var web3Wrapper = require('./js/Web3Wrapper');
web3Wrapper.initWeb3("http://106.15.62.222:8545");
// web3Wrapper.initWeb3("http://localhost:8545");


var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var orm = require("orm");

var gethApi = require('./js/routes/gethApi');
var contractVht = require('./js/routes/contractVht');   //VHToken contract
var contractAct = require('./js/routes/contractAct');  //ACToken Contract

var ethLightWallet = require('./js/routes/ethLightWallet');
var userApi = require('./js/routes/userApi');
var sqlDBConfig = require("./js/config/sqlDB.json");
var sqlDBUtils = require('./js/sqlDBUtils');

var request = require('request');


var app = express();

var api = web3Wrapper.web3.version.api;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



// Wallet JS
var ethUtil                  = require('ethereumjs-util');
ethUtil.crypto               = require('crypto');
ethUtil.Tx                   = require('ethereumjs-tx');
ethUtil.scrypt               = require('scryptsy');
ethUtil.uuid                 = require('uuid');
ethUtil.WAValidator          = require('wallet-address-validator');
global.ethUtil               = ethUtil;
var format                   = require('string-format');
global.format                = format;
var browser                  = require('detect-browser');
global.browser               = browser;
var Wallet                   = require('./js/wallet/myetherwallet');
global.Wallet                = Wallet;

var Token                    = require('./js/wallet/tokenlib');
global.Token                 = Token;
var globalFuncs              = require('./js/wallet/globalFuncs');
global.globalFuncs           = globalFuncs;





// 读取合约abi
var result = JSON.parse(fs.readFileSync(path.join(__dirname, 'VHToken.json')));

var abi = result.abi;


//db connection by using orm
app.use(orm.express(sqlDBConfig, {
    define: function (db, models, next) {
        var listModels = require("./js/model/sqlModels");
        listModels(db, models);
        sqlDBUtils.setModels(models);
        console.log('Mysql connected to ' + sqlDBConfig.protocol + "://" + sqlDBConfig.host + "/" + sqlDBConfig.database);
        next();
    }
}));


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

app.use('/contractVHT',contractVht); //VHToken contract route;
app.use('/contractACT',contractAct); //ACToken contract route;

app.use('/userAPI', userApi);

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