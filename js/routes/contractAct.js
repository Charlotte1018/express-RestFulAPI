var express = require("express");
var router = express.Router();

var constants = require('../constants/constants');
var web3Wrapper = require('../Web3Wrapper');

var fs = require('fs');
var path = require('path');
var result = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/contracts/ACToken.json')));
var abi = result.abi;
var myContract = web3Wrapper.web3.eth.contract(abi);
var myContractAddress = constants.contractACTAddress;//获取当前的地址；


var myContractInst = myContract.at(myContractAddress);

var api = web3Wrapper.web3.version.api;


router.get('/icoStatus',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    var isFinalized = myContractInst.isFinalized.call();
    var isHalted = myContractInst.isHalted.call();
    var currentBalanceInWei = web3Wrapper.web3.eth.getBalance(myContractAddress);
    var currentBalance = web3Wrapper.web3.fromWei(currentBalanceInWei);
    var name = myContractInst.name.call();
    var symbol = myContractInst.symbol.call();

    res.send([
        {"name":"name","value":name},
        {"name":"symbol","value":symbol},
        {"name":"currentBalance","value":currentBalance},
        { "name":"isFinalized","value": isFinalized },
        { "name":"isHalted","value": isHalted }

    ])
});

router.get('/tokenInfo',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    var p0Rate = myContractInst.p0Rate.call();
    var p1Rate = myContractInst.p1Rate.call();
    var p2Rate = myContractInst.p2Rate.call();
    var p3Rate = myContractInst.p3Rate.call();
    var currRate = myContractInst.tokenRate.call();

    res.send([
        {"name":"currRate","value":currRate},
        {"name":"p0Rate","value":p0Rate},
        {"name":"p1Rate","value":p1Rate},
        {"name":"p2Rate","value":p2Rate},
        {"name":"p3Rate","value":p3Rate}
    ]);
});

router.get('/blockInfo',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");

    var currentBlockNumber = web3Wrapper.web3.eth.blockNumber;
    var fundingStartBlock = parseInt(myContractInst.fundingStartBlock.call());
    var fundingEndBlock = parseInt(myContractInst.fundingEndBlock.call());

    var p0Period = parseInt(myContractInst.p0Period.call());
    var p1Period = parseInt(myContractInst.p1Period.call());
    var p2Period = parseInt(myContractInst.p2Period.call());

    var fundingP0EndBlock = fundingStartBlock + p0Period;
    var fundingP1EndBlock = fundingStartBlock + p1Period;
    var fundingP2EndBlock = fundingStartBlock + p2Period;
    


    res.send([{"name":"currentBlockNumber","value":currentBlockNumber},
        {"name":"fundingStartBlock","value":fundingStartBlock},
        {"name":"fundingP0EndBlock","value":fundingP0EndBlock},
        {"name":"fundingP1EndBlock","value":fundingP1EndBlock},
        {"name":"fundingP2EndBlock","value":fundingP2EndBlock},
        {"name":"fundingEndBlock","value":fundingEndBlock}
    ]);
});

router.get('/accountInfo',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");

    var actFund = web3Wrapper.web3.fromWei(myContractInst.actFund.call());
    var tokenCreationCap = web3Wrapper.web3.fromWei(myContractInst.tokenCreationCap.call());
    var totalSupply = web3Wrapper.web3.fromWei(myContractInst.totalSupply.call());


    var ethFundDeposit = myContractInst.ethFundDeposit.call();
    var actFundDeposit = myContractInst.actFundDeposit.call();

    res.send([{"name":"actFund","value":actFund},
        {"name":"tokenCreationCap","value":tokenCreationCap},
        {"name":"totalSupply","value":totalSupply},

        {"name":"ethFundDeposit","value":ethFundDeposit},
        {"name":"actFundDeposit","value":actFundDeposit}
    ]);
});

router.get('/otherInfo',function(req,res){
    res.send([{
        
    }])
})

module.exports = router;