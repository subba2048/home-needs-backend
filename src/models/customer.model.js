const mysqlConnection = require("../../connection");

const getCustomerByID = function(ID,callback){
    mysqlConnection.query("select * from customer where id = "+ID+";",(err, rows, fields)=>{
        if(!err){
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};


const createCustomer = function(payLoad,callback){
    var keys = Object.keys(payLoad);
    var colums = "", values ="";
    keys.forEach(key => {
        colums+=key+",";
        values+="'"+payLoad[key]+"',";
    });
    colums = colums.substring(0, colums.length - 1);
    values = values.substring(0, values.length - 1);

    const sqlQuery = "insert into customer ("+colums+") values ("+values+");";

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


module.exports = {
    getCustomerByID: getCustomerByID,
    createCustomer: createCustomer
}