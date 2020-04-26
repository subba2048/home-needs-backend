const mysqlConnection = require("../../connection");
const SOScheduleModel = require('../models/SOschedule.model');

const getServiceOfferBySPID = function(SPID,callback){
    mysqlConnection.query("select * from service_offer where service_provider_id_fk = "+SPID+";",(err, rows, fields)=>{
        if(!err){
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};


const createServiceOfferAndSchedule = function(payLoad,callback){


    const days = payLoad['days'];
    const startTime = payLoad['start_time'];
    const endTime = payLoad['end_time'];
    const sqlQuery = "INSERT INTO service_offer (services_id_fk, service_provider_id_fk, price_range,available_to_match) VALUES ('"+payLoad['services_id_fk']+"', '"+payLoad['service_provider_id_fk']+"', '"+payLoad['price_range']+"', '"+payLoad['available_to_match']+"');"
    

    mysqlConnection.query(sqlQuery,(err, rows, fields)=>{
        if(!err){
            var insertId = rows.insertId+'';
            console.log('Last insert ID:', insertId);
            for(var i=0;i<days.length;i++){
                var schedulePayload = {
                    service_offer_id_fk: insertId,
                    day: days[i],
                    start_time: startTime,
                    end_time: endTime
                };
                SOScheduleModel.createsoschedule(schedulePayload,function(err,rows){
                    if(!err)
                        console.log(rows)
                    else
                    console.log(err);
                })
            }
            return callback(null,insertId);
        }else{
            return callback(err);
        }
    })
};


module.exports = {
    getServiceOfferBySPID: getServiceOfferBySPID,
    createServiceOfferAndSchedule: createServiceOfferAndSchedule
}