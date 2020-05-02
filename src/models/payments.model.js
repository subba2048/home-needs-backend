const mysqlConnection = require("../../connection");
const jobModel = require('./jobs.model');

const stripe = require('stripe')('sk_test_NRvYvirXBcxz3YjC5HPc0hL200djInxiBv');


//customer id/userid, payload = {amount: }
const createPayment = function(userID,jobID,payLoad,callback){
    //create payment update job 
    // id, payment_date, amount, transaction_number, status

    //charge customer
    //get the stripecustomerid
    let sql = `SELECT stripe_customer_id FROM customer WHERE user_id_fk = ${userID}`;
    mysqlConnection.query(sql, (err, result)=>{
        if(err){
            return callback(err);
        }
        let stripeCustomerId = result[0].stripe_customer_id;
        stripe.charges.create({
            amount: parseInt(payLoad.amount) * 100,
            currency: 'usd',
            customer: stripeCustomerId,
          }, function(error, charge){
              if (error){
                  return callback(error);
              }
              //prints the charge object
              console.log(charge);
              payLoad['payment_date'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
              payLoad['transaction_number']= charge.id; 
              payLoad['status'] = charge.status;
              
              //pay our sp
              //to indicate acceptance on their stripe account we have to do perform an update account call, providing the acceptance date(as a timestamp and users ip address)
              //this should be just below after the connect account creation
              /*
              stripe.accounts.update(
                  accountid,
                  {
                      tos_acceptance:{
                          date: Math.floor(Date.now()/1000),
                          ip: request.connection.remoteaddress
                      }
                  }
              ).then(()=>{

              });
              */
             
              //insert payment
              keys = Object.keys(payLoad);
              const columns = "", values ="";
              keys.forEach(key => {
                    columns += key+",";
                    values += payLoad[key]+",";
              });
              columns = columns.substring(0, columns.length - 1);
              values = values.substring(0, values.length - 1);
              let sql2 = `INSERT INTO payment (${columns}) VALUES (${values})`;
              mysqlConnection.query(sql2, (erro, reslt)=>{
                  if(erro){
                      return callback(erro);
                  }
                  const jobPayload = {
                    columnName: 'payment_id_fk',
                    updateValue: reslt.insertId
                 }
                 //update job
                 jobModel.updateJob(jobID,jobPayload,function(errr,rows){
                    if(!errr){
                        return callback(null,rows.insertId);
                    }else{
                        return callback(errr);
                    }
                 })
              });
          });
    });
};

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

/*
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
*/

module.exports = {
    getAllPaymentsInSystem: getAllPaymentsInSystem,
    getPaymentByID: getPaymentByID,
    updatePaymentStatus: updatePaymentStatus,
    createPayment: createPayment
};