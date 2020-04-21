const express = require("express");
const Router = express.Router();


//Create user API
Router.post("/exist",(req,res, next)=>{
    const payLoad = req.body;
    // if(!payLoad['user_since'] || payLoad['user_since']=='')
    //     payLoad['user_since'] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // userModel.createUser(payLoad,function(err,rows){
    //     if(!err){
    //         res.send(rows);
    //     }
    //     else{
    //         res.send(err);
    //     }
    // })
    if(payLoad['flag']=='true')
        res.json({exist: true});
    else
    res.json({exist: false});
});

module.exports = Router;