const express = require("express");
const Router = express.Router();
const userModel = require("../models/user.model");
const userSchema = require("../schema/user.schema");

//Get all users
Router.get("/",(req, res, next)=>{
    userModel.getUsers(function(err,rows){
        if(!err)
        res.send(null,rows);
        else
        res.send(err);
        // rows.forEach( (row) => {
        //     console.log(`${row.name} lives in ${row.city}`);
        //   });
    }
)});
//Get single user by ID
Router.get("/:id",(req,res, next)=>{
    userModel.getUserByID(req.params.id,function(err,rows){
        if(!err)
        res.send(null,rows);
        else
        res.send(err);
    })
});

//Update user API
Router.post("/update/:id",(req,res,next)=>{
    const payLoad = req.body;
    userModel.updateUser(req.params.id,payLoad,function(err,rows){
        if(!err)
        res.send(null,rows);
        else
        res.send(err);
    })
})
//Create user API
Router.post("/create",(req,res, next)=>{
    const payLoad = req.body;
    if(!payLoad['user_since'] || payLoad['user_since']=='')
        payLoad['user_since'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    userModel.createUser(payLoad,function(err,rows){
        if(!err){
            res.send(null,rows);
        }
        else{
            res.send(err);
        }
    })
});

Router.delete("/:id",(req,res,next)=>{
    userModel.deleteUser(req.params.id,function(err,rows){
        if(!err){
            res.send(null,rows);
        }
        else{
            res.send(err);
        }
    })
});


module.exports = Router;