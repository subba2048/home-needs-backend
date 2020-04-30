const express = require("express");
const Router = express.Router();
const userModel = require("../models/user.model");
const userSchema = require("../schema/user.schema");
const loginModel = require("../models/login.model");
const locationModel = require('../models/location.model');
const customerModel = require("../models/customer.model");
const phoneNumberModel = require('../models/phoneNumber.model');
const bckInfoModel = require('../models/bckCheck.model');
const serviceProviderModel = require('../models/serviceProvider.model');
const licenseInfoModel = require('../models/licenseInfo.model');
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
// Router.post("/create",(req,res,next)=>{
//     const payLoad = req.body;
//     if(!payLoad['user_since'] || payLoad['user_since']=='')
//     payLoad['user_since'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
//     userModel.createUser(payLoad)
//     .then(function(rows) {
//         const userID = rows.insertId;
//         console.log("Success!", rows);
//         res.send(rows);
//       }).catch(function(error) {
//         console.log("Failed!", error);
//         res.send(rows);
//       })
// })

//Create customer API -NEED TO SAVE SERVICE ADDRESS
Router.post("/register/customer",(req,res, next)=>{
    const payLoad = req.body;
    if(!payLoad['user_since'] || payLoad['user_since']=='')
        payLoad['user_since'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    payLoad['user_type'] = 'customer';
    payLoad['status'] = 'active';

    loginModel.canCreateLogin(payLoad['email'])
    .then(function(result){
        return new Promise((resolve, reject) => {
            if(result == false)
                reject({dataError:'User already exists!'});
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
            address_type : 'home',
            city: payLoad['user_city'],
            country: 'United States',
            state: payLoad['user_state'],
            zipcode: payLoad['user_zipcode']
        };
        return new Promise((resolve, reject) => {
            locationModel.createLocation(addressPayload,function(err,rows){
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
            customerModel.createCustomer(customerPayload,function(err,customerID){
                if(!err){
                    resolve(customerID);
                }
                else{
                    reject(err);
                }
            })
          });
    })
    .then(function(customerID){
        res.json({userID: payLoad['user_id_fk'],customerID: customerID});
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
    payLoad['user_type'] = 'service_provider';
    payLoad['status'] = 'active';

    loginModel.canCreateLogin(payLoad['email'])
    .then(function(result){
        return new Promise((resolve, reject) => {
            if(result == false)
                reject({dataError:'User with this email already exists!'});
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
            address_type : 'home',
            city: payLoad['user_city'],
            country: 'United States',
            state: payLoad['user_state'],
            zipcode: payLoad['user_zipcode']
        };
        
        return new Promise((resolve, reject) => {
            locationModel.createLocation(addressPayload,function(err,rows){
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
        payLoad['addressID'] = addressID;
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
        //create phone number
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
        //create bck info
        return new Promise((resolve, reject) => {
            bckInfoModel.createBckInfo(payLoad,function(err,rows){
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
            stripe.createAccount(payLoad['stripe_token'],function(err,result){
                if(!err){
                    resolve(result);
                }
                else{
                    reject(err);
                }
            })
          });
    })
    .then(function(result){
        //create service provider
        var serviceProviderPayload = {
            do_not_disturb: 0,
            is_verified: 1,
            provides_emergency_service: payLoad['provides_emergency_service'],
            job_title: '',
            stripe_account_id: result['stripeAccountID'],
            stripe_card: result['stripeCard'],
            stripe_token_id: payLoad['stripe_token'], 
            user_id_fk: payLoad['user_id_fk']
        };
        // id, user_id_fk, job_title, provides_emergency_service, do_not_disturb, licence_info_idlicence_info, is_verified
        return new Promise((resolve, reject) => {
            serviceProviderModel.createServiceProvider(serviceProviderPayload,function(err,serviceProviderID){
                if(!err){
                    resolve(serviceProviderID);
                }
                else{
                    reject(err);
                }
            })
          });
    })
    .then(function(serviceProviderID){
        //create license info
        payLoad['serviceProviderID'] = serviceProviderID;
        const validFrom = payLoad['valid_from'];
        const validUpto = payLoad['valid_upto'];
        var fromDate = new Date(validFrom['year'],validFrom['month']-1,validFrom['day'], 0, 0, 0, 0).toISOString().slice(0, 19).replace('T', ' ');
        var toDate = new Date(validUpto['year'],validUpto['month']-1,validUpto['day'], 0, 0, 0, 0).toISOString().slice(0, 19).replace('T', ' ');
        const licencePayload = {
            licence_number: payLoad['licence_number'],
            licence_desc: payLoad['licence_desc'],
            valid_from: fromDate,
            valid_upto: toDate
        };
        return new Promise((resolve, reject) => {
            licenseInfoModel.createLicenseInfo(licencePayload,function(err,licenseID){
                if(!err){
                    resolve(licenseID);
                }
                else{
                    reject(err);
                }
            })
          });
    })
    .then(function(licenseID){
        //update service provider
        return new Promise((resolve, reject) => {
            serviceProviderModel.updateLicenseInfo(payLoad['serviceProviderID'],licenseID,function(err,rows){
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
        res.json({userID: payLoad['user_id_fk'],serviceProviderID: payLoad['serviceProviderID']});
    })
    .catch(function(error) {
        console.log("Failed!", error);
        res.send(error);
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