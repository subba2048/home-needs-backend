const mysqlConnection = require("../../connection");
const SRScheduleModel = require("./schedule.model");

const getJobs = function(callback){
    mysqlConnection.query("select * from job;",(err, rows, fields)=>{
        if(err) return callback(err);
        return callback(null,rows);
    });
};
//update use fks
const getJobsByID = function(jobID,callback){
    const query = `select * from job where id = '`+jobID+`';`;

    mysqlConnection.query(query,(err, rows, fields)=>{
        if(!err){
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

//update use fks
const getJobsByCustomerID = function(custID,callback){
    mysqlConnection.query(`select * from job where customer_id_fk = '`+custID+`';`,(err, rows, fields)=>{
        if(!err){
            console.log(`Changed ${rows.changedRows} row(s)`);
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};
//update use fks

const getJobsBySPID = function(SPID,callback){
    mysqlConnection.query(`select * from job where service_provider_id_fk = '`+SPID+`';`,(err, rows, fields)=>{
        if(!err){
            console.log(`Changed ${rows.changedRows} row(s)`);
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

const updateJob = function(jobID,payLoad,callback){
    const columnName = payLoad['columnName'];
    const updateValue = payLoad['updateValue'];
    const sqlQuery = "update job set "+columnName+" = '"+updateValue+"' where id = "+jobID+";";
    mysqlConnection.query(sqlQuery,(err, rows, fields)=>{
        if(!err){
            console.log(`Changed ${rows.changedRows} row(s)`);
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

const updateJobStatus = function(jobID,status,callback){

    const sqlQuery = "update job set job_status = '"+status+"' where id = "+jobID+";";
    mysqlConnection.query(sqlQuery,(err, rows, fields)=>{
        if(!err){
            console.log(`Changed ${rows.changedRows} row(s)`);
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

//get jobids by a userID for customer
const getJobsByUserIDCustomer = (userID, callback)=>{
    let sql = `SELECT job.id as job_id FROM user, customer, job WHERE user.id = customer.user_id_fk and customer.id = job.customer_id_fk and user.id = ${userID}`;
    mysqlConnection.query(sql, (err, result)=>{
        if(err){
            return callback(err);
        }
        //console.log(result);
        let jobIds = [];
        //convert the result array of objects with job_ids to array of job_ids.
        result.forEach((element) => {
            jobIds.push(element.job_id);
        });
        return callback(jobIds);
    });
};

//get jobids by a userID for a service provider
const getJobsByUserIDServiceProvider = (userID, callback)=>{
    let sql = `SELECT job.id as job_id FROM user, service_provider, job WHERE user.id = service_provider.user_id_fk and service_provider.id = job.service_provider_id_fk and user.id = ${userID}`;
    mysqlConnection.query(sql, (err, result)=>{
        if(err){
            return callback(err);
        }
        //console.log(result);
        let jobIds = [];
        //convert the result array of objects with job_ids to array of job_ids.
        result.forEach((element) => {
            jobIds.push(element.job_id);
        });
        return callback(jobIds);
    });
};


const deleteJobs = function(jobID,callback){

    const sqlQuery = "delete job where id = "+jobID+";";
    mysqlConnection.query(sqlQuery,(err, rows, fields)=>{
        if(!err){
            console.log(`Deleted ${rows.affectedRows} row(s)`);
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

const createJob = function(payLoad,callback){
    payLoad['job_status'] = 'job_created';
    var keys = Object.keys(payLoad);
    var colums = "", values ="";
    keys.forEach(key => {
        colums+=key+",";
        values+="'"+payLoad[key]+"',";
    });
    colums+='payment_id_fk';
    values+=null
    // colums = colums.substring(0, colums.length - 1);
    // values = values.substring(0, values.length - 1);
    const sqlQuery = "insert into job ("+colums+") values ("+values+");";
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

//Input should have necessay payload to create a job. quote_id_fk, customer_id_fk, service_provider_id_fk, services_id_fk, address_id_fk
const createJobSchedule = (payLoad)=>{
    return new Promise((resolve, reject)=>{
        createJob(payLoad, (errr, jobId)=>{
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
                let sql2 = `SELECT service_request_id_fk FROM quote WHERE id = ${payLoad.quote_id_fk};`;
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
            var v1 = jobScheduleObject['date_requested'];
            var startDate = v1.getFullYear() + "-" + (v1.getMonth() + 1) + "-" + v1.getDate();
            var v2 = jobScheduleObject['end_date'];
            var endDate = v2.getFullYear() + "-" + (v2.getMonth() + 1) + "-" + v2.getDate();
            var freq = ['one_time', 'daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'semi_annual', 'annual'];
            const f = jobScheduleObject['frequency'];
            var repeat;
            if(f == 'one_time'){
                repeat = 0;
            }else if(f == 'daily'){
                repeat = 1;
            }else if(f == 'weekly'){
                repeat = 7;
            }else if(f == 'biweekly'){
                repeat = 14;
            }else if(f == 'monthly'){
                repeat = 30;
            }else if(f == 'quarterly'){
                repeat = 120;
            }else if(f == 'semi_annual'){
                repeat = 180;
            }else if(f == 'annual'){
                repeat = 365;
            }
            metaSchedule['job_schedule_id_fk'] = jobScheduleObject['job_schedule_id_fk'];
            metaSchedule['job_id_fk'] = jobScheduleObject['job_id_fk'];
            metaSchedule['repeat_start'] = startDate;
            metaSchedule['repeat_interval'] = repeat;
            metaSchedule['repeat_end'] = endDate;  //null; update this, what should be the column name?
            metaSchedule['start_time'] = jobScheduleObject['time_requested'];
            let timeSplit = jobScheduleObject['time_requested'].split(':');
            let timeSplitHour = parseInt(timeSplit[0]) + jobScheduleObject['no_of_hours'];
            metaSchedule['end_time'] = timeSplitHour + ":" + timeSplit[1] + ":00";

            var keys = Object.keys(metaSchedule);
            var colums = "", values ="";
            keys.forEach(key => {
                colums+=key+",";
                values+="'"+metaSchedule[key]+"',";
            });

            colums = colums.substring(0, colums.length - 1);
            values = values.substring(0, values.length - 1);
            const sqlQuery = "insert into job_schedule_meta ("+colums+") values ("+values+");";
            mysqlConnection.query(sqlQuery, (err, result)=>{
                if(err){
                    return callback(err);
                }
                //return the insertId for job_schedule_meta, will there be multiple job_schedule_meta?
                return callback(result.insertId+'');
            })
        })
        .catch((error)=>{
            return callback(error)
        })
}



module.exports = {
    getJobs: getJobs,
    getJobsByID: getJobsByID,
    getJobsByCustomerID: getJobsByCustomerID,
    getJobsBySPID: getJobsBySPID,
    getJobsByUserIDCustomer: getJobsByUserIDCustomer,
    getJobsByUserIDServiceProvider: getJobsByUserIDServiceProvider,
    updateJob: updateJob,
    updateJobStatus: updateJobStatus,
    deleteJobs: deleteJobs,
    createJob: createJob,
    createJobSchedule: createJobSchedule,
    createJobScheduleMeta: createJobScheduleMeta
};