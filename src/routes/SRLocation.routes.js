const express = require("express");
const Router = express.Router();
const SRLocationModel = require('../models/SRLocation.model');


//modify the index.routes.js with
/*
const SRLocationRouter = require('./SRLocation.routes');
router.use('/srlocation', SRLocationRouter);
*/

//Get a service request location in detail
Router.get("/:srid", (req, res)=>{
    SRLocationModel.getSRLocation(req.params.srid, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
        
    });
});

//Create new service request location 
Router.post("/create", (req, res)=>{
    const payLoad = req.body;
    const SRID = payLoad['SRID'];
    SRLocationModel.createSRLocation(SRID, payLoad, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

module.exports = Router;