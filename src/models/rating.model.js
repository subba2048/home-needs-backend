const mysqlConnection = require("../../connection");

//Get the ratings for a service provider
//Input Service provider id and a callback function
const getRatings = function(userID, callback){
    let sql = `SELECT review_text, rating_value, user_id_user_fk, user_id_rater_fk FROM rating WHERE user_id_user_fk = ${userID}`;
    mysqlConnection.query(sql, (err, result)=>{
        if(err){
            return callback(err);
        }
        //console.log(result);
        return callback(result);
    });
};

//Create a rating from a user
//Inputs rater ID i.e. the user id of the rater, payload object, and a callback function
const createRating = function(userID, payLoad, callback){
    let sql = `INSERT INTO rating (review_text, rating_value, user_id_user_fk, user_id_rater_fk) VALUES ('${payLoad.review_text}', '${payLoad.rating_value}', ${payLoad.ratedID}, ${userID})`;
    mysqlConnection.query(sql, (err, result)=>{
        if(err){
            return callback(err);
        }
        return callback(result);
    })
};

//Update a rating for a unique combination of userID and SPID
//Inputs userID, SPID, payload object, and a callback function
const updateRating = function(userID, SPID, payLoad, callback){
    let sql = `UPDATE rating, service_provider SET review_text = '${payLoad.review_text}', rating_value = '${payLoad.rating_value}', user_id_user_fk = service_provider.user_id_fk, user_id_rater_fk = '${userID}' where service_provider.id = '${SPID}'`;
    mysqlConnection.query(sql, (err, result)=>{
        if(err){
            return callback(err);
        }
        return callback(result);
    });
}

//Delete a rating for a unique combination of userID and SPID
//Inputs userID, SPID, and a callback function
const deleteRating = function(userID, SPID, callback){
    let sql = `DELETE FROM rating WHERE user_id_rater_fk = '${userID}' and user_id_user_fk IN (SELECT service_provider.user_id_fk FROM service_provider WHERE service_provider = '${SPID}')`;
    mysqlConnection.query(sql, (err, result)=>{
        if(err){
            return callback(err);
        }
        return callback(result);
    });
};


module.exports ={
    getRatings,
    createRating,
    updateRating,
    deleteRating
}