const express = require("express");
const Router = express.Router();
const scheduleModel = require("../models/SOSchedule.model");

Router.get("/", (req, res, next) => {
    scheduleModel.getSOSchedule(function(err,rows) {
     if (!err)
     res.send(rows);
     else 
     res.send(err);

    }
    )});

    Router.post("/update/:id",(req,res,next) => {
        const payload = req.body;
        scheduleModel.updateSOSchedule(req.params.id,payload,function(err,rows) {
            if (!err)
            res.send(rows);
            else 
            res.send(err);
        })
    })

    Router.post("/create/:id", (req,res,next) => {
        const payload = req.body; 
        scheduleModel.createSOSchedule(payload, function(err,rows) {
            if (!err) {
            res.send(rows);
            
        } else {
            res.send(err);
        }
        })
    });





    module.exports = Router;