const express = require("express");
const Router = express.Router();
const jobsModel = require("../models/jobs.model");

//DO NOT USE
Router.get("/custID/:custID",(req, res, next)=>{
    const custID = req.params.custID;
    jobsModel.getJobsByCustomerID(custID,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
        // rows.forEach( (row) => {
        //     console.log(`${row.name} lives in ${row.city}`);
        //   });
    }
)});

//DO NOT USE
Router.get("/SPID/:SPID",(req, res, next)=>{
    const SPID = req.params.SPID;
    jobsModel.getJobsBySPID(SPID,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
        // rows.forEach( (row) => {
        //     console.log(`${row.name} lives in ${row.city}`);
        //   });
    }
)});

//Get jobs by id
Router.get("/:id",(req,res, next)=>{
    jobsModel.getJobsByID(req.params.id,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    });
});

//get jobs by userId for customers
Router.get('/customer/:userID', (req, res)=>{
    jobsModel.getJobsByUserIDCustomer(req.params.userID, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            //an array of job ids
            res.send(result);
        }
    });
});

//get jobs by userId for service providers
Router.get('/sp/:userID', (req, res)=>{
    jobsModel.getJobsByUserIDServiceProvider(req.params.userID, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            //an array of job ids
            res.send(result);
        }
    });
});

//create job, quote_id_fk, customer_id_fk, service_provider_id_fk, services_id_fk, address_id_fk, req.body
Router.post("/create",(req,res,next)=>{
    
    let payLoad = {};
    payLoad["quote_id_fk"] = req.body["quote_id_fk"];
    payLoad["customer_id_fk"] = req.body["customer_id_fk"];
    payLoad["service_provider_id_fk"] = req.body["service_provider_id_fk"];
    payLoad["services_id_fk"] = req.body["services_id_fk"];
    payLoad["address_id_fk"] = req.body["address_id_fk"];
    const email = req.body["email"];
    //using createScheduleMeta
    jobsModel.createJobScheduleMeta(email, payLoad,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
})

Router.post("/update/:id",(req,res,next)=>{
    const payLoad = req.body;
    const jobID = req.params.id;
    const status = payLoad['status'];
    jobsModel.updateJobStatus(jobID,status,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
})


module.exports = Router;