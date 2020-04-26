const mysqlConnnection = require("../../connection");

//allows for the retrieval of a a service offer schedule
const getsoschedule = function(callback) {
    mysqlConnnection.query("select * from so_schedule", (err,rows,fields) => {
        if(!err) return callback(err);
        return callback(null, rows);
    })
};
//allows for the creation of a service offer schedule
const createsoschedule = function(payLoad, callback) {
//     var records = [
//         [1, 'Yashwant', 'Chavan'],
//         [2, 'Diwakar', 'Patil'],
//         [3, 'Anoop', 'More']
// ];

// var sql = "INSERT INTO trn_employee (employee_id, first_name, last_name) VALUES ?";

// var query = connection.query(sql, [records], function(err, result) {
// console.log(result);
// });
    let spquery = "Insert into so_schedule (service_offer_id_fk, day, start_time, end_time) values ('"+payLoad['service_offer_id_fk']+"','"+payLoad['day']+"', '"+payLoad['start_time']+"', '"+payLoad['end_time']+"');";
    mysqlConnnection.query(spquery, (err,rows) => {
        if (!err) {
            var insertId = rows.insertId+'';
            console.log('Last insert ID:', insertId);
            return callback(null,insertId);
    } else {
        return callback(err);
	}
    })
};
//allows for the update of a service offer schedule
const updatesoschedule = function (so_scheduleID,payload,callback){
    const column = payload['column'];
    const upval = payload['upval'];
    let updquery = "update so_schedule set "+column+" = "+upval+" where ID = "+so_scheduleID+"; ";
    mysqlConnnection.query(updquery, (err, rows, fields) => {
        if(!err){
            console.log(`Changed ${rows.changedRows} row(s)` );
            return callback(null,rows);

        }
        else {
            return callback(err);
        }
    })
};
//export the modules
module.exports = {
 getsoschedule: getsoschedule,
 createsoschedule: createsoschedule,
 updatesoschedule: updatesoschedule
};
