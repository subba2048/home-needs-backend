const express = require("express");
const Router = express.Router();
const servicesModel = require("../models/services.model");

//Get all services
Router.get("/",(req, res, next)=>{
    servicesModel.getServices(function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
        // rows.forEach( (row) => {
        //     console.log(`${row.name} lives in ${row.city}`);
        //   });
    }
)});
//Get services by parentID
Router.get("/:id",(req,res, next)=>{
    servicesModel.getUserByCategory(req.params.id,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
});


module.exports = Router;