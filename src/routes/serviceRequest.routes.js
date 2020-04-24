const express = require("express");
const Router = express.Router();
const serviceRequestModel = require("../models/serviceRequest.model");

//Get SR by customer ID
Router.get("/:id",(req,res, next)=>{
    const custID = req.params.id;
    serviceRequestModel.getServiceRequestByCustID(custID,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
});

//Create new SR
Router.post("/create", (req, res)=>{
    const payLoad = req.body;
    payLoad['available_to_match'] = 1;

    serviceRequestModel.createServiceRequest(payLoad, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.json({SRID: result});
        }
    });
});


module.exports = Router;