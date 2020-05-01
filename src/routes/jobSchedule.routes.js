const express = require("express");
const Router = express.Router();
const jobScheduleModel = require("../models/jobSchedule.model");

//modify the index.routes.js with
/*
const jobScheduleRouter = require('./jobSchedule.routes');
router.use('/jobschedule', jobScheduleRouter);
*/

//get job schedule meta by job id
Router.get('/:jobID', (req, res)=>{
    jobScheduleModel.getjobScheduleMetaByJobId(req.params.jobID, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

/*
//create new job schedule meta
Router.post('/create', (req, res)=>{
    let payLoad = req.body;
    jobScheduleModel.createJobScheduleMeta(payLoad, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});
*/

//update a job schedule meta
Router.post('/update', (req, res)=>{
    let payLoad = req.body;
    jobScheduleModel.updateJobScheduleMeta(payLoad, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

module.exports = Router;