/**
 * Created by hepen on 7/2/2017.
 */
let sqlDBUtils = function(){
    let models;
    let setModels = function(inModels){
        models = inModels;
    };
    let getModels = function(){
        return models;
    };
    return {
        setModels,
        getModels
    }
}();

module.exports = sqlDBUtils;