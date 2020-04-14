const mysqlConnection = require("../../connection");

const getServices = function(callback){
    mysqlConnection.query("select * from services;",(err, rows, fields)=>{
        if(err) return callback(err);
        return callback(null,rows);
    });
};

const getUserByCategory = function(parentID,callback){
    mysqlConnection.query("select * from services where services_id_parent_fk = "+parentID+";",(err, rows, fields)=>{
        if(!err){
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

module.exports = {
    getServices: getServices,
    getUserByCategory: getUserByCategory
};