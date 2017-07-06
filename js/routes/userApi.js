/**
 * Created by hepen on 7/2/2017.
 */
var express = require("express");
var router = express.Router();
var sqlDBUtils = require('../../js/sqlDBUtils');

router.post("/create", function(req, res) {
    var user = req.body;
    var userModel = sqlDBUtils.getModels().user;
    userModel.create(user, (err) => {
        if (err) throw err;
        res.send({
            "status":0,
            "result": user
        });
    });
});

router.post("/update/:id", function(req, res) {
    var id = req.params.id;
    var newUser = req.body;
    var userModel = sqlDBUtils.getModels().user;
    userModel.find({id: id}, (err, result) => {
        if (err) throw err;
        if (!result || !result.length) {
            res.send([]);
            return;
        }
        result = Object.assign(result[0], newUser);
        result.save(function(err) {
            res.send({
                "status":"0",
                "result":result
            });
        });
    });
});

router.get("/:id", function(req, res) {
    var id = req.params.id;
    var userModel = sqlDBUtils.getModels().user;
    userModel.find({id: id}, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

module.exports = router;