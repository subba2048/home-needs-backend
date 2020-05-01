const mysqlConnection = require("../../connection");
const jobModel = require('./jobs.model');

const getAllPaymentsInSystem = function(callback){
    mysqlConnection.query("select * from payment;",(err, rows, fields)=>{
        if(err) return callback(err);
        return callback(null,rows);
    });
};
//update use fks
const getPaymentByID = function(paymentID,callback){
    const query = `select * from payment where id = '`+paymentID+`';`;

    mysqlConnection.query(query,(err, rows, fields)=>{
        if(!err){
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};


const updatePaymentStatus = function(paymentID,status,callback){

    const sqlQuery = "update payment set job_status = '"+status+"' where id = "+paymentID+";";
    mysqlConnection.query(sqlQuery,(err, rows, fields)=>{
        if(!err){
            console.log(`Changed ${rows.changedRows} row(s)`);
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};


const createPayment = function(jobID,payLoad,callback){
    //create payment update job 
    // id, payment_date, amount, transaction_number, status

    //chanrge customer
    //payour SP
    //3rd inser payment
    // 4 update job
    payLoad['status'] = 'completed';
    const sqlQuery = "insert into payment (payment_date, amount, transaction_number, status) VALUES ? ;";
    mysqlConnection.query(sqlQuery,payLoad,(err, rows, fields)=>{
        if(!err){
            var insertId = rows.insertId+'';
            console.log('Last insert ID:', insertId);
            const jobPayload = {
                columnName: payment_id_fk,
                updateValue: insertId
            }
            jobModel.updateJob(jobID,jobPayload,function(err,rows){
                if(!err){
                    return callback(null,insertId);
                }else{
                    return callback(err);
                }
            })
        }else{
            return callback(err);
        }
    })
};


module.exports = {
    getAllPaymentsInSystem: getAllPaymentsInSystem,
    getPaymentByID: getPaymentByID,
    updatePaymentStatus: updatePaymentStatus,
    createPayment: createPayment
};