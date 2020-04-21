const express = require("express");
const Router = express.Router();
const scheduleModel = require("../models/schedule.model");

//router
Router.get("/", (req, res,next) => {
    scheduleModel.getsrschedule(function(err,rows) {
     if (!err) 
     res.send(rows);
     else
     res.send(err);

    })
});
    //router
    Router.post("/update/:id",(req,res,next) => {
        const payload = req.body;
        scheduleModel.updatesrschedule(req.params.id,payload,function(err,rows) {
            if (!err)
            res.send(rows);
            else 
            res.send(err);
        })
    });
    //router
    Router.post("/create/:id", (req,res,next) => {
        const payload = req.body; 
        scheduleModel.createsrschedule(payload, function(err,rows) {
            if (!err) {
            res.send(rows);
            
        } else {
            res.send(err);
        }
        })
    });


    
    //export the module
    module.exports = Router;