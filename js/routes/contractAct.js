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


router.get('/test001',function(req,res){
    console.log("hello world!");
    console.log(myContractAddress);
    //console.log(myContractInst);
    res.send("test001");
})


router.get('/icoStatus',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    var isFinalized = myContractInst.isFinalized.call();
    var isHalted = myContractInst.isHalted.call();
    res.send([
        { "name":"isFinalized","value": isFinalized },
        { "name":"isHalted","value": isHalted }
    ])
});

router.get('/tokenInfo',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");

    var name = myContractInst.name.call();
    var symbol = myContractInst.symbol.call();
    var currentBalanceInWei = web3Wrapper.web3.eth.getBalance(myContractAddress);
    var currentBalance = web3Wrapper.web3.fromWei(currentBalanceInWei);


    var p0Rate = myContractInst.p0Rate.call();
    var p1Rate = myContractInst.p1Rate.call();
    var p2Rate = myContractInst.p2Rate.call();
    var p3Rate = myContractInst.p3Rate.call();
    var currRate = myContractInst.tokenRate.call();

    res.send([{"name":"p0Rate","value":p0Rate},
        {"name":"p1Rate","value":p1Rate},
        {"name":"p2Rate","value":p2Rate},
        {"name":"p3Rate","value":p3Rate},
        {"name":"currRate","value":currRate},

        {"name":"name","value":name},
        {"name":"symbol","value":symbol},
        {"name":"currentBalance","value":currentBalance}
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

// router.get('/accountInfo',function(req,res){
//     res.setHeader("Access-Control-Allow-Origin", "*");

//     var vhPreIcoAmount = web3Wrapper.web3.fromWei(myContractInst.vhPreIcoAmount.call());
//     var vhIcoAmount = web3Wrapper.web3.fromWei(myContractInst.vhIcoAmount.call());
//     var vhAllocatedAmount = web3Wrapper.web3.fromWei(myContractInst.vhAllocatedAmount.call());
//     var vhICOCap = web3Wrapper.web3.fromWei(myContractInst.vhICOCap.call());

//     var preICO_VenheAcc = myContractInst.preICO_VenheAcc.call();
//     var ico_VenheAcc = myContractInst.ico_VenheAcc.call();
//     var allocated_venheAcc = myContractInst.allocated_venheAcc.call();
//     var ethAcc = myContractInst.ethAcc.call();


//     res.send([{"name":"vhPreIcoAmount","value":vhPreIcoAmount},
//         {"name":"vhIcoAmount","value":vhIcoAmount},
//         {"name":"vhAllocatedAmount","value":vhAllocatedAmount},
//         {"name":"vhICOCap","value":vhICOCap},

//         {"name":"preICO_VenheAcc","value":preICO_VenheAcc},
//         {"name":"ico_VenheAcc","value":ico_VenheAcc},
//         {"name":"allocated_venheAcc","value":allocated_venheAcc},
//         {"name":"ethAcc","value":ethAcc}

//     ]);
// });

module.exports = router;