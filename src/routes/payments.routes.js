const express = require("express");
const Router = express.Router();
const paymentsModel = require("../models/payments.model");

//Get payment by id
Router.get("/:id",(req,res, next)=>{
    paymentsModel.getPaymentByID(req.params.id,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
});

//create payment and updates job with payment fk
Router.post("/create",(req,res,next)=>{
    const payLoad = req.body;
    const jobID = payLoad['jobID'];
    paymentsModel.createPayment(jobID,payLoad,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
})

Router.post("/update/:id",(req,res,next)=>{
    const payLoad = req.body;
    const paymentID = req.params.id;
    const status = payLoad['status'];
    paymentsModel.updatePaymentStatus(paymentID,status,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
})


module.exports = Router;