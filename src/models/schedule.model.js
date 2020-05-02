const mysqlConnection = require("../../connection");

//get sr schedule by service request id
const getSRSchedule = function (srID, callback){
    let sql = `select * from sr_schedule where service_request_id_fk = ${srID}`;
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            return callback(err);
        }
        //return an object with date requested, time requested, frequency, no_of_hours
        return callback(null,result);
    });
};

//create a service request schedule
const createSRSchedule = function(payLoad,callback){
    // let timeRequested = payLoad['time_requested'].hour + ":"+payLoad['time_requested'].minute + ":00";
    const sql = `INSERT into sr_schedule (service_request_id_fk, date_requested, time_requested, frequency, no_of_hours,end_date) values (${payLoad['service_request_id_fk']}, '${payLoad['date_requested']}', '${payLoad['time_requested']}', '${payLoad['frequency']}', '${payLoad['no_of_hours']}', '${payLoad['end_date']}' );`;
    mysqlConnection.query(sql,(err, rows, fields)=>{
        if(!err){
            var insertId = rows.insertId+'';
            console.log('Last insert ID:', insertId);
            return callback(null,insertId);
        }else{
            return callback(err);
        }
    });
};



const updatesrschedule = function(sr_requestID,payLoad,callback){
    const column = payLoad['column'];
    const upval = payLoad['upval'];
    const sql = "update sr_schedule set "+column+" = '"+upval+"' where ID = "+sr_requestID+";";
    mysqlConnection.query(sql,(err, rows, fields)=>{
        if(!err){
            console.log (`Changed ${rows.changedRows} row(s)`)
           return callback(null,rows);
        }else{
            return callback(err);
        }
    });
};

/*
const createsrschedule = function(payLoad,callback){
    const sqlq = "insert into sr_schedule (service_request_id_fk, date_requested, time_requested, frequency) values ('"+payLoad['service_request_id_fk']+"', '"+payLoad['YYYY-MM-DD']+"', '"+payLoad['HHH:MM:SS']+"', '"+payLoad['frequency']+"' );";
    mysqlConnection.query(sqlq,(err, rows, fields)=>{
        if(!err){
            var insertId = rows.insertId+'';
            console.log('Last insert ID:', insertId);
            return callback(null,insertId);
        }else{
            return callback(err);
        }
    });
};
*/

module.exports = {
    getSRSchedule: getSRSchedule,
    createsrschedule: createSRSchedule,
    updatesrschedule: updatesrschedule

};