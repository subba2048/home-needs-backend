const mysqlConnection = require("../../connection");

const getsrschedule = function(callback){
    mysqlConnection.query("select * from sr_schedule; ",(err, rows, fields)=>{
        if(err) return callback(err);
        return callback(null,rows);
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

module.exports = {
    getsrschedule: getsrschedule,
    createsrschedule: createsrschedule,
    updatesrschedule: updatesrschedule

};