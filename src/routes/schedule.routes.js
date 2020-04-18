const express = require("express");
const Router = express.Router();
const scheduleModel = require("../models/schedule.model");

Router.get("/", (req, res, next) => {
    scheduleModel.getSRSchedule(function(err,rows) {
     if (!err)
     res.send(rows);
     else 
     res.send(err);

    }
    )});

    Router.post("/update/:id",(req,res,next) => {
        const payload = req.body;
        scheduleModel.updateSRSchedule(req.params.id,payload,function(err,rows) {
            if (!err)
            res.send(rows);
            else 
            res.send(err);
        })
    })

    Router.post("/create/:id", (req,res,next) => {
        const payload = req.body; 
        console.log("testinggithub")
        scheduleModel.createSRSchedule(payload, function(err,rows) {
            if (!err) {
            res.send(rows);
            
        } else {
            res.send(err);
        }
        })
    });





    module.exports = Router;
