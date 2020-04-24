//LOGIN AND REGISTER USER
const express = require("express");
const Router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginModel = require('../models/login.model');
const userModel = require('../models/user.model');

Router.use(cors());
process.env.SECRET_KEY = 'secret';

// const jwtKey = 'my_secret_key'
//NEED TO CHANGE
Router.post('/register', (req, res) => {
  const today = new Date()
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created: today
  }

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    //TODO bcrypt
    .then(user => {
      if (!user) {
        User.create(userData)
          .then(user => {
            // let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            //   expiresIn: 1440
            // })
            const token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
              algorithm: 'HS256',
              expiresIn: 1440
            })
            res.json({ token: token })
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

Router.post('/login', (req, res) => {
  loginModel.authenticateUser(req.body,(err, result)=>{
    if(err){
      res.send('Error: ' + err)
    }
    else{
      let userExists = false;
      if(result.length>0)
        userExists = true;
      
      if (userExists) {
        const responsePayload = JSON.parse(JSON.stringify(result[0]));
        const resultPassword = responsePayload['password'];
        if(bcrypt.compareSync(req.body.password, resultPassword)){
          const token = jwt.sign(responsePayload, process.env.SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: 1440
          })
          console.log('token:', token)
          res.json({ token: token })
        }
        else {
          //password does not match
          res.send({dataError:'User does not exist'});
        }
      }else {
        //email does not match
        res.send({dataError:'User does not exist'});
      }
    }
    
  });
})

Router.get('/profile', (req, res) => {

  try {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
  }
  catch (ex) { res.error(ex.message); 
  }
  
  var userID = decoded['user_id_fk'];

  userModel.getUserByID(userID,(err, result)=>{
    if(err){
      res.send('Error: ' + err)
    }
    else{
      let userExists = false;
      if(result.length>0)
        userExists = true;
      if (userExists) {
        res.json(result[0]);
      }else {
        res.send({dataError:'User does not exist'});
      }
    }
  })
})

module.exports = Router;