var express = require("express");
var router = express.Router();

var constants = require('../constants/constants');
var web3Wrapper = require('../Web3Wrapper');

var fs = require('fs');
var path = require('path');
var result = JSON.parse(fs.readFileSync(path.join(__dirname, '../../VHToken.json')));
var abi = result.abi;
var myContract = web3Wrapper.web3.eth.contract(abi);
var myContractInst = myContract.at(constants.contractAddress);


var api = web3Wrapper.web3.version.api;

router.get('/icoStatus',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    var isFinalized = myContractInst.isFinalized.call();
    var isPreICO = myContractInst.isPreICO.call();
    var isHalted = myContractInst.isHalted.call();
    res.send([{ "name":"isFinalized","value": isFinalized },{ "name":"isPreICO","value": isPreICO },{ "name":"isHalted","value": isHalted }
    ])
});


router.get('/tokenInfo',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");

    var name = myContractInst.name.call();
    var symbol = myContractInst.symbol.call();
    var currentBalance = web3Wrapper.web3.eth.getBalance(constants.contractAddress);

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
});

router.get('/blockInfo',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");

    var currentBlockNumber = web3Wrapper.web3.eth.blockNumber;
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
});

router.get('/accountInfo',function(req,res){
    res.setHeader("Access-Control-Allow-Origin", "*");

    var vhPreIcoAmount = web3Wrapper.web3.fromWei(myContractInst.vhPreIcoAmount.call());
    var vhIcoAmount = web3Wrapper.web3.fromWei(myContractInst.vhIcoAmount.call());
    var vhAllocatedAmount = web3Wrapper.web3.fromWei(myContractInst.vhAllocatedAmount.call());
    var vhICOCap = web3Wrapper.web3.fromWei(myContractInst.vhICOCap.call());

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

module.exports = router;