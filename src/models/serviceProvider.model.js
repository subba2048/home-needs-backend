const mysqlConnection = require("../../connection");

const getServiceProviders = function(callback){
    mysqlConnection.query("SELECT * FROM service_provider;",(err, rows, fields)=>{
        if(err) return callback(err);
        return callback(null,rows);
    });
};

const getServiceProviderByID = function(ID,callback){
    mysqlConnection.query("SELECT * FROM service_provider where id = "+ID+";",(err, rows, fields)=>{
        if(!err){
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

const createServiceProvider = function(payLoad,callback){
    var keys = Object.keys(payLoad);
    var colums = "", values ="";
    keys.forEach(key => {
        colums+=key+",";
        values+="'"+payLoad[key]+"',";
    });
    colums = colums.substring(0, colums.length - 1);
    values = values.substring(0, values.length - 1);

    const sqlQuery = "insert into service_provider ("+colums+") values ("+values+");";
    
    mysqlConnection.query(sqlQuery,(err, rows, fields)=>{
        if(!err){
            var insertId = rows.insertId+'';
            console.log('Last insert ID:', insertId);
            return callback(null,insertId);
        }else{
            return callback(err);
        }
    })
};


const updateLicenseInfo = function(spID,licenseID,callback){

    const sqlQuery = "update service_provider set licence_info_idlicence_info = '"+licenseID+"' where id = "+spID+";";
    mysqlConnection.query(sqlQuery,(err, rows, fields)=>{
        if(!err){
            console.log(`Changed ${rows.changedRows} row(s)`);
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

module.exports = {
    getServiceProviders: getServiceProviders,
    getServiceProviderByID: getServiceProviderByID,
    createServiceProvider: createServiceProvider,
    updateLicenseInfo: updateLicenseInfo
};