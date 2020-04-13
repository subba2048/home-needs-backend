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
    const sqlQuery = "insert into service_provider (id, user_id_fk, Job_title, provides_emergency_service, do_not_disturb, licence_info_idlicence_info, is_verified) values (1, 2, 'House_cleaner', 1, 0, 1, 1);";
    mysqlConnection.query(sqlQuery,(err, rows, fields)=>{
        if(!err){
            var insertId = { insertId: rows.insertId};
            console.log('Last insert ID:', rows.insertId);
            return callback(null,insertId);
        }else{
            return callback(err);
        }
    })
};


module.exports = {
    getServiceProviders: getServiceProviders,
    getServiceProviderByID: getServiceProviderByID,
    createServiceProvider: createServiceProvider
};