/**
 * Created by hepen on 7/1/2017.
 */
var Web3 = require('web3');
module.exports = {
    web3: null,

    initWeb3: function (url){
        this.web3 = new Web3(new Web3.providers.HttpProvider(url));
    }
};