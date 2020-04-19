const express = require("express");
const Router = express.Router();
const scheduleModel = require("../models/SOschedule.model");

//router
Router.get("/", (req, res,next) => {
    scheduleModel.getsoschedule(function(err,rows) {
     if (!err) 
     res.send(rows);
     else
     res.send(err);

    })
});
    //router
    Router.post("/update/:id",(req,res,next) => {
        const payload = req.body;
        scheduleModel.updatesoschedule(req.params.id,payload,function(err,rows) {
            if (!err)
            res.send(rows);
            else 
            res.send(err);
        })
    });
    //router
    Router.post("/create/:id", (req,res,next) => {
        const payload = req.body; 
        scheduleModel.createsoschedule(payload, function(err,rows) {
            if (!err) {
            res.send(rows);
            
        } else {
            res.send(err);
        }
        })
    });





    module.exports = Router;