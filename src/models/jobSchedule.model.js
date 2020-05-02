const mysqlConnection = require("../../connection");
const jobsModel = require("./jobs.model");
const SRScheduleModel = require("./schedule.model")

//get job schedule meta by job id
const getjobScheduleMetaByJobId = (jobId, callback)=>{
    let sql = `SELECT * FROM job_schedule_meta WHERE job_id_fk = ${jobId}`;
    mysqlConnection.query(sql, (err, result)=>{
        if(err){
            return callback(err);
        }
        return result;
    });
};

//Input should have necessay payload to create a job. quote_id_fk, customer_id_fk, service_provider_id_fk, services_id_fk, address_id_fk
const createJobSchedule = (payLoad)=>{
    return new promise((resolve, reject)=>{
        jobsModel.createJob(payLoad, (errr, jobId)=>{
            if(errr){
                return reject(errr);
            }
            let sql = `INSERT INTO job_schedule (job_id_fk) VALUE (${jobId})`;
            mysqlConnection.query(sql, (err, result)=>{
                if(err){
                    return reject(err);
                }
                //the insertId for newly created job_schedule entry
                let jobScheduleID = result.insertId;
                //write a query by using quote_id_fk to get the service_request_id, using that call getsrSchdeule()
                let sql2 = `SELECT service_request_id_fk FROM quote WHERE id = ${payLoad.quote_id_fk}`;
                mysqlConnection.query(sql2, (error, reslt)=>{
                    if(error){
                        return reject(error);
                    }
                    let srId = reslt[0].service_request_id_fk;
                    SRScheduleModel.getSRSchedule(srId,(er, res)=>{
                        if(er){
                            return reject(er);
                        }
                        //add the jobid and jobscheduleid with the res[0] object
                        res[0]['job_id_fk'] = jobId;
                        res[0]['job_schedule_id_fk'] = jobScheduleID;
                        //return an object with keys: date_requested, time_requested, frequency, no_of_hours, job_id and job_schedule_id_fk
                        return resolve(res[0]);
                    });
                });
            });
        });   
    });
}

//Input should have necessay payload to create a job.
const createJobScheduleMeta = (payLoad, callback)=>{
    createJobSchedule(payLoad)
        .then((jobScheduleObject)=>{
            let metaSchedule = {};
            metaSchedule['job_schedule_id_fk'] = jobScheduleObject['job_schedule_id_fk'];
            metaSchedule['job_id_fk'] = jobScheduleObject['job_id_fk'];
            metaSchedule['repeat_start'] = jobScheduleObject['date_requested'];
            metaSchedule['repeat_interval'] = jobScheduleObject['frequency'];
            metaSchedule['repeat_end'] = jobScheduleObject['repeat_end'];  //null; update this, what should be the column name?
            metaSchedule['start_time'] = jobScheduleObject['time_requested'];
            let timeSplit = jobScheduleObject['time_requested'].split(':');
            let timeSplitHour = parseInt(timeSplit[0]) + jobScheduleObject['no_of_hours'];
            metaSchedule['end_time'] = timeSplitHour + ":" + timeSplit[1] + ":00";
            keys = Object.keys(metaSchedule);
            const colums = "", values ="";
            keys.forEach(key => {
                columns += key+",";
                values += metaSchedule[key]+",";
            });
            colums = colums.substring(0, colums.length - 1);
            values = values.substring(0, values.length - 1);
            const sql = `INSERT job_schedule_meta ('${columns}') VALUES ('${values}')`;
            mysqlConnection.query(sql, (err, result)=>{
                if(err){
                    return callback(err);
                }
                //return the insertId for job_schedule_meta, will there be multiple job_schedule_meta?
                return callback(result.insertId);
            })
        })
        .catch((error)=>{
            return callback(error)
        })
}


//update job_schedule_meta by jobid for only one attribute
const updateJobScheduleMeta = (jobId, payLoad, callback)=>{
    let key = Object.keys(payload);
    let val = Object.values(payLoad);
    
    let sql = `UPDATE job_schedule_meta SET '${key}' = ${val} where job_id_fk = ${jobId}`;
    mysqlConnection.query(sql, (err, result)=>{
        if(err){
            return callback(err);
        }
        else{
            return callback(result.insertId);
        }
    });
};



module.exports = {
    getjobScheduleMetaByJobId,
    createJobSchedule,
    createJobScheduleMeta,
    updateJobScheduleMeta
};