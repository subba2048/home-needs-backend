const express = require("express");
const Router = express.Router();
const locationModel = require("../models/location.model");

//Get a user location in detail
Router.get("/location/:id", (req, res)=>{
    locationModel.getLocation(req.params.id, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
        
    });
});

//Update user location API
Router.post("/location/:id", (req, res)=>{
    const payLoad = req.body;
    locationModel.updateLocation(req.params.id, payLoad, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

//Create new location API
Router.post("/location/create", (req, res)=>{
    const payLoad = req.body;
    locationModel.createLocation(payLoad, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

module.exports = Router;