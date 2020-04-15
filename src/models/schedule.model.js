const mysqlConnnection = require("../../connection");

//retrieve the schedule
const getSRSchedule = function (callback) {
    mysqlConnnection.query("select * from  sr_schedule", (err, rows, fields) => {
        if(!err) return callback(err);
        return callback(null, rows);
    });
};
//create a service request schedule
const createSRSchedule = function (payload,callback) {
    const schquery = "Insert into SR_Schedule (service_request_id_fk, date_requested, time_requested, frequency) values ('"+payload['service_request_id_fk']+"', '"+payload['date_requested']+"', '"+payload['time_requested']+"', '"+payload['frequency']+"' );";
    mysqlConnnection.query (schquery,(err, rows, fields) => {
        if (!err) {
            var inid = {inid: rows.inid};
            console.log('Last insert ID:', rows.inid);
            return callback(null,inid);
    } else {
        return callback(err);
    }
});


//update a service request schedule
const updateSRSchedule = function (SR_scheduleID,payload,callback){
    const name = payload['name'];
    const upval = payload['upval'];
    const updquery = "Update SR_schedule set "+name+" ='"+upval+"' where ID = "+SR_scheduleID+"; ";
    mysqlConnnection.query(updquery,(err,rows,fields) => {
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
    getSRSchedule: getSRSchedule,
    createSRSchedule :createSRSchedule,
    updateSRSchedule: updateSRSchedule

}};