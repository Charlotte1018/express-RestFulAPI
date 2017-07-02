var express = require("express");
var router = express.Router();
var request = require('request');
var lightwallet = require('eth-lightwallet');

var constants = require('../constants/constants');
var web3Wrapper = require('../Web3Wrapper');
var keythereum = require("keythereum");
var HookedWeb3Provider = require("hooked-web3-provider");

router.get('/test001',function(req,res){
    console.log("test001");
    res.send("test001 okay");
});










module.exports = router;