const express = require("express");
const Router = express.Router();
const ratingModel = require("../models/rating.model");

//modify the index.routes.js with
/*
const ratingRouter = require('./rating.routes');
router.use('/ratings', ratingRouter);
*/

//Get the ratings for a Service provider
Router.get("/:id", (req, res)=>{
    ratingModel.getRatings(req.params.id, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

//Create a new rating API
Router.post("/create/:id", (req, res)=>{
    const payLoad = req.body;
    ratingModel.createRating(req.params.id, payLoad, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

//Update rating API
Router.post("/update/:id/:spid", (req, res)=>{
    const payLoad = req.body;
    ratingModel.updateRating(req.params.id, req.params.spid, payLoad, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

//Delete rating API
Router.delete("/delete/:id/:spid", (req, res)=>{
    ratingModel.deleteRating(req.params.id, req.params.spid, (err, result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

module.exports = Router;