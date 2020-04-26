const express = require("express");
const Router = express.Router();
const serviceOfferModel = require("../models/serviceOffer.model");

//Get SR by customer ID
Router.get("/:id",(req,res, next)=>{
    const SPID = req.params.id;
    serviceOfferModel.getServiceOfferBySPID(SPID,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
});

//Create new SR
Router.post("/create", (req, res)=>{
    //create all SO and add SO schedule
    const payLoad_array = req.body;
    // id, services_id_fk, service_provider_id_fk, price_range, available_to_match
    //call for each item
    var serviceIDArray = [];
    var errExists= false;
    var errValue;
    var totalCalls = 0;
    for(var i=0;i<payLoad_array.length; i++){
        serviceOfferModel.createServiceOfferAndSchedule(payLoad_array[i], (err, result)=>{
            if(err){
                errExists = true;
                errValue = err;
            }
            else{
                serviceIDArray.push(result[0]);
            }
            totalCalls++;
            if(totalCalls == payLoad_array.length){
                if(errExists)
                    res.send(err);
                else
                    res.send({serviceOfferIDArray: serviceIDArray});
            }
        });
    }
});


module.exports = Router;