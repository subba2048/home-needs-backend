const mysqlConnnection = require("../../connection");

//allows for the retrieval of a a service offer schedule
const getSOSchedule = function(callback) {
    mysqlConnnection.query("select * from SO_schedule", (err,rows,fields) => {
        if(!err) return callback(err);
        return callback(null, rows);
    });
};
//allows for the creation of a service offer schedule
const createSOSchedule = function(payload, callback) {
    const spquery = "Insert into so_schedule (service_offer_id_fk, start_date, end_date, day, start_time, end_time) values ('"+payload['service_offer_id_fk']+"', '"+payload['start_date']+"', '"+payload['end_date']+"', '"+payload['day']+"', '"+payload['start_time']+"', '"+payload['end_time']+"'  );";
    mysqlConnnection.query(spquery, (err,rows,fields) => {
        if (!err) {
            var inid = {inid: rows.inid};
            console.log('Last insert ID:', rows.inid);
            return callback(null,inid);
    } else {
        return callback(err);
	}
    })
};
//allows for the update of a service offer schedule
const updateSOSchedule = function (SO_scheduleID,payload,callback){
    const name = payload['name'];
    const upval = payload['upval'];
    const updquery = "update SO_schedule set "+name+" = "+upval+" where ID = "+SO_scheduleID+"; ";
    mysqlConnnection.query(updquery, (err, rows, fields) => {
        if(!err){
            console.log( 'Changed ${rows.changedRows} row(s)' );
            return callback(null,rows);

        }
        else {
            return callback(err);
        }
    })
};
//export the modules
module.exports = {
 getSOSchedule: getSOSchedule,
 createSOSchedule: createSOSchedule,
 updateSOSchedule: updateSOSchedule
};
