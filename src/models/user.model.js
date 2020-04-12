const mysqlConnection = require("../../connection");

const getUsers = function(callback){
    mysqlConnection.query("select * from user;",(err, rows, fields)=>{
        if(err) return callback(err);
        return callback(null,rows);
    });
};

const getUser = function(userID,callback){
    mysqlConnection.query("select * from user where id = "+userID+";",(err, rows, fields)=>{
        if(!err){
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

const deleteUser = function(userID,callback){
    mysqlConnection.query("update user set status = 'deleted' where id = "+userID+";",(err, rows, fields)=>{
        if(!err){
            console.log(`Changed ${rows.changedRows} row(s)`);
            // console.log(`Deleted ${result.affectedRows} row(s)`);
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

const updateUser = function(userID,payLoad,callback){
    const columnName = payLoad['columnName'];
    const updateValue = payLoad['updateValue'];
    const sqlQuery = "update user set "+columnName+" = '"+updateValue+"' where id = "+userID+";";
    mysqlConnection.query(sqlQuery,(err, rows, fields)=>{
        if(!err){
            console.log(`Changed ${rows.changedRows} row(s)`);
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

const createUser = function(payLoad,callback){
    const sqlQuery = "insert into user (first_name, middle_name, last_name, user_type, address_id_fk, status, user_since) values ('"+payLoad['first_name']+"','"+payLoad['middle_name']+"','"+payLoad['last_name']+"','"+payLoad['user_type']+"','"+payLoad['address_id_fk']+"','"+payLoad['status']+"','"+payLoad['user_since']+"');";
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
    getUsers: getUsers,
    getUser: getUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    createUser: createUser
};