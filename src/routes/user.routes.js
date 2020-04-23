const express = require("express");
const Router = express.Router();
const userModel = require("../models/user.model");
const userSchema = require("../schema/user.schema");
const loginModel = require("../models/login.model");
const addModel = require('../models/address.model');
const customerModel = require("../models/customer.model");
const phoneNumberModel = require('../models/phoneNumber.model');
const stripe = require("../shared/stripe");

const cors = require('cors');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
Router.use(cors());
// process.env.SECRET_KEY = 'secret';

//Get all users
Router.get("/",(req, res, next)=>{
    userModel.getUsers(function(err,rows){
        if(!err)
        res.send(rows);
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
        res.send(rows);
        else
        res.send(err);
    })
});

//Update user API
Router.post("/update/:id",(req,res,next)=>{
    const payLoad = req.body;
    userModel.updateUser(req.params.id,payLoad,function(err,rows){
        if(!err)
        res.send(rows);
        else
        res.send(err);
    })
})

//DELETE LATER
Router.post("/create",(req,res,next)=>{
    const payLoad = req.body;
    if(!payLoad['user_since'] || payLoad['user_since']=='')
    payLoad['user_since'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    userModel.createUser(payLoad)
    .then(function(rows) {
        const userID = rows.insertId;
        console.log("Success!", rows);
        res.send(rows);
      }).catch(function(error) {
        console.log("Failed!", error);
        res.send(rows);
      })
})

//Create customer API -NEED TO SAVE SERVICE ADDRESS
Router.post("/register/customer",(req,res, next)=>{
    const payLoad = req.body;
    if(!payLoad['user_since'] || payLoad['user_since']=='')
        payLoad['user_since'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    payLoad['user_type'] = 'customer';
    payLoad['status'] = 'registered';

    loginModel.canCreateLogin(payLoad['email'])
    .then(function(result){
        return new Promise((resolve, reject) => {
            if(result == false)
                reject(Error({dataError:'User already exists!'}));
            else{

                //create user
                userModel.createUser(payLoad,function(err,userID){
                    if(!err){
                        resolve(userID);
                    }
                    else{
                        reject(err);
                    }
                })
            }
        });
    })
    .then(function(userID) {
        //create login
        payLoad['user_id_fk'] = userID;
        const hash = bcrypt.hashSync(payLoad['password'],10);
        payLoad['password'] = hash;
        const loginPayload = {
            email: payLoad['email'],
            password: payLoad['password'],
            user_id_fk: payLoad['user_id_fk']
        };
        return new Promise((resolve, reject) => {
            loginModel.createLogin(loginPayload,function(err,rows){
                if(!err){
                    resolve(rows);
                }
                else{
                    reject(err);
                }
            })
          });
    })
    .then(function(loginID){
        //create address
        var addressPayload = {
            address_line_1: payLoad['user_address_line_1'],
            address_line_2: payLoad['user_address_line_2'],
            address_type : 'user',
            city: payLoad['user_city'],
            country: 'United States',
            state: payLoad['user_state'],
            zipcode: payLoad['user_zipcode']
        };
        return new Promise((resolve, reject) => {
            addModel.createAddress(addressPayload,function(err,rows){
                if(!err){
                    resolve(rows);
                }
                else{
                    reject(err);
                }
            })
          });
    })
    .then(function(addressID){
        //update user address
        return new Promise((resolve, reject) => {
            userModel.updateUserAddress(payLoad['user_id_fk'],addressID,function(err,rows){
                if(!err){
                    resolve(rows);
                }
                else{
                    reject(err);
                }
            })
          });

    })
    .then(function(rows){
        return new Promise((resolve, reject) => {
            phoneNumberModel.createPhoneNumber(payLoad,function(err,rows){
                if(!err){
                    resolve(rows);
                }
                else{
                    reject(err);
                }
            })
          });
    })
    .then(function(rows){
        //create stripe user
        return new Promise((resolve, reject) => {
            stripe.createCustomer(payLoad['email'],payLoad['stripe_token'],function(err,stripeCustomerID){
                if(!err){
                    resolve(stripeCustomerID);
                }
                else{
                    reject(err);
                }
            })
          });
    })
    .then(function(stripeCustomerID){
        //create customer
        var customerPayload = {
            is_verified: 1,
            payment_info_saved: 1,
            stripe_customer_id: stripeCustomerID,
            stripe_token_id: payLoad['stripe_token'], 
            user_id_fk: payLoad['user_id_fk']
        };
        return new Promise((resolve, reject) => {
            customerModel.createCustomer(customerPayload,function(err,rows){
                if(!err){
                    resolve(rows);
                }
                else{
                    reject(err);
                }
            })
          });
    })
    .then(function(rows){
        res.send(rows);
    })
    .catch(function(error) {
        console.log("Failed!", error);
        res.send(error);
    });

});

Router.post("/register/sp",(req,res, next)=>{
    const payLoad = req.body;
    if(!payLoad['user_since'] || payLoad['user_since']=='')
        payLoad['user_since'] = new Date().toISOString().slice(0, 19).replace('T', ' ');



    userModel.createUser(payLoad)
    .then(function(rows) {
        const userID = rows;
        console.log("Success!", response);
      }).catch(function(error) {
        console.log("Failed!", error);
      });
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