const express = require("express");
const Router = express.Router();
const SOLocationModel = require('../models/SOLocation.model');

//modify the index.routes.js with
/*
const SOLocationRouter = require('./SOLocation.routes');
router.use('/solocation', SOLocationRouter);
*/

//Get a service request location in detail
Router.get("/:spid", (req, res)=>{
    SOLocationModel.getSOLocation(req.params.spid, (err, result)=>{
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
    const SPID = payLoad['SPID'];
    SOLocationModel.createSOLocation(SPID, payLoad, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

module.exports = Router;