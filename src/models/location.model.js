const mysqlConnection = require("../../connection");
const nodeGeocoder = require('node-geocoder');

let options = {
    provider: 'google',
    apiKey: 'AIzaSyArJdzeIxOCChZ4zy2J2tNx9T2_u0Bn91U', //make it an environment variable
    formatter: null
};

const geoCoder = nodeGeocoder(options);


//Get the location details of a user
//Inputs userID and a callback function
const getLocation = function (userID, callback){
    let sql = `SELECT address_line_1, address_line_2, address_line_3, city, state, country, zipcode FROM user, address WHERE address.id = user.address_id_fk and user.id = ${userID}`;
    mysqlConnection.query(sql,(err, result)=>{
        if(err){
            return callback(err);
        }
        //console.log(result);
        return callback(result);
    });
};


//Update the location details of a user
//Inputs userID, payLoad object, and a callback function
const updateLocation = function(userID, payLoad, callback){
    let sql = `UPDATE address, user SET address_type = '${payLoad.address_type}', address_line_1 = '${payLoad.address_line_1}', address_line_2 = '${payLoad.address_line_2}', address_line_3 = '${payLoad.address_line_3}', city = '${payLoad.city}', state = '${payLoad.state}', country = '${payLoad.country}', zipcode = '${payLoad.zipcode}' WHERE address.id = user.address_id_fk and user.id = ${userID}`;
    mysqlConnection.query(sql,(err, result)=>{
        if(err) {
            return callback(err);
        }
        //console.log(result);
        return callback(result);
    });
};

//Insert a new location details 
//Inputs payLoad object and a callback function
const createLocation = function(payLoad, callback){
    let sql = `INSERT INTO address (address_type, address_line_1, address_line_2, address_line_3, city, state, country, zipcode) VALUES ('${payLoad.address_type}', '${payLoad.address_line_1}', '${payLoad.address_line_2}', '${payLoad.address_line_3}', '${payLoad.city}', '${payLoad.state}', '${payLoad.country}', '${payLoad.zipcode}')`;
    mysqlConnection.query(sql,(err, result)=>{
        if(err){
            return callback(err);
        }
        //console.log(result);
        return callback(result);
    });
};


//Get the location zipcode for a user
//Inputs userID and a callback function
const getZipCode = function(userID, callback){
    let sql = `SELECT zipcode FROM user, address WHERE address.id = user.address_id_fk and user.id = ${userID}`
    mysqlConnection.query(sql,(err, result)=>{
        if(err){
            return callback(err);
        } 
        //console.log(result[0].zipcode);
        return callback(result[0].zipCode);
    });
};


//Get the location latitude and longitude according to the zipcode for a user
//Inputs userID and a callback function
const getLongLat = function(userID, callback){
    let sql = `SELECT zipcode FROM user, address WHERE address.id = user.address_id_fk and user.id = ${userID}`
    mysqlConnection.query(sql,(err, result)=>{
        if(err){
            return callback(err);
        }
        let zipCode = result[0].zipcode;
        let address = zipCode +', USA';
        geoCoder.geocode(address)
            .then((rest) =>{
                const point = {
                    latitude: rest[0].latitude,
                    longitude: rest[0].longitude
                };
                //console.log(point);
                return callback(point);
            })
            .catch((error)=>{
                return callback(error);
            });
    });
};

//Calculate distance between two points using Great Circle Formula
//input two points and a callback function
const distanceCalculation = function(point1, point2, callback){
    var lat1 = parseFloat(point1.latitude);
    var lat2 = parseFloat(point2.latitude);
    var long1 = parseFloat(point1.longitude);
    var long2 = parseFloat(point2.latitude);

    var R = 3958.8 // earth's mean radius in miles
    var phi1 = lat1 * Math.PI/180;
    var phi2 = lat2 * Math.PI/180;
    var delPhi = (lat2 - lat1) * Math.PI/180;
    var delLambda = (long2 - long1) * Math.PI/180;;

    var a = Math.sin(delPhi/2) * Math.sin(delPhi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(delLambda/2) * Math.sin(delLambda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var distance = R * c;

    return callback(distance);
};



module.exports = {
    getLocation,
    updateLocation,
    createLocation,
    getZipCode,
    getLongLat,
    distanceCalculation
};