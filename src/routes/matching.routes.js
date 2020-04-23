const express = require("express");
const Router = express.Router();


//TEST FUNCTION: GET Quotes array
Router.post("/exist",(req,res, next)=>{
    const payLoad = req.body;
    if(payLoad['flag']=='true')
        // res.json({exist: true},{quotesArray: []});
        res.json({exist: true});
    else
    res.json({exist: false});
});

//ACTUAL FUNCTION: GET Quotes array
Router.post("/",(req,res, next)=>{
    const payLoad = req.body;
        // make call to matching model
        //return quotes array
        // res.json({quotesArray: []});
        // res.send(error);
    

});

Router.post("/update",(req,res, next)=>{
    const payLoad = req.body;
    //update quotes with the SR ID
});
module.exports = Router;