const express = require("express");
const Router = express.Router();
const userModel = require("../models/user.model");

//Get all users
Router.get("/",(req, res, next)=>{
    userModel.getUsers(function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    }
)});
//Get single user by ID
Router.get("/:id",(req,res, next)=>{
    userModel.getUser(req.params.id,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
});

//Update user API
Router.post("/:id",(req,res,next)=>{
    const payLoad = req.body;
    userModel.updateUser(req.params.id,payLoad,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
})
//Create user API
Router.post("/create",(req,res, next)=>{
    const payLoad = req.body;
    userModel.createUser(payLoad,function(err,rows){
        if(!err){
            res.send(rows);
        }
        else{
            res.send(err);
        }
    })
});

Router.delete("/:id",(req,res,next)=>{
    userModel.deleteUser(req.params.id,function(err,rows){
        if(!err){
            res.send(rows);
        }
        else{
            res.send(err);
        }
    })
});


module.exports = Router;