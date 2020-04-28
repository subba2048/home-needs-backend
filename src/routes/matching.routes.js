const express = require("express");
const Router = express.Router();
const matchingModel = require('../models/matching.model');


//TEST FUNCTION: GET Quotes array
Router.post("/exist",(req,res, next)=>{
    const payLoad = req.body;
    if(payLoad['flag']=='true')
        // res.json({exist: true},{quotesArray: []});
        res.json({exist: true});
    else
    res.json({exist: false});
});

//modify the index.routes.js with
/*
const matchingRouter = require('./matching.routes');
router.use('/matching', matchingRouter);
*/

//ACTUAL FUNCTION: GET Quotes array
Router.post("/",(req,res, next)=>{
    const payLoad = req.body;
    // make call to matching model
    matchingModel.getMatching(payLoad, (err, result)=>{
        if(err){
            res.send(error);
        }
        else{
            //return matched array of objects
            res.json(result);
        }
    });
});

//Create the quotes
Router.post("/create", (req, res)=>{
    //get the matched quote array from the above function
    const payLoad = req.body;
    matchingModel.createQuote(payLoad, (err, userQuoteIds)=>{
        if(err){
            res.send(err);
        }
        else{
            //send the insertIds array
            res.json(userQuoteIds);
        }
    });
});

//Update the quotes table for a specific quote id with SRID and job confirmed
Router.post("/update/:id",(req,res, next)=>{
    const payLoad = req.body;
    //update quotes with the SR ID
    matchingModel.updateQuote(req.params.id, payLoad,(err, insertId)=>{
        if(err){
            res.send(err);
        }
        else{
            //send the updated insert id .
            res.send(insertId);
        }
    });
});

module.exports = Router;