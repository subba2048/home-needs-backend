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
const getLocation = (userID, callback)=>{
    let sql = `SELECT address_type, address_line_1, address_line_2, address_line_3, city, state, country, zipcode, latitude, longitude FROM user, address WHERE address.id = user.address_id_fk and user.id = ${userID}`;
    mysqlConnection.query(sql,(err, result)=>{
        if(err){
            return callback(err);
        }
        //console.log(result);
        return callback(result);
    });
};



//Get the latitude and longitude of a location using Google Geocoding API
//Input an address object with city, state, zipcode, and country
const getLongLat = (address) =>{
    return new Promise((resolve, reject)=>{
        geoCoder.geocode(address)
            .then((result)=>{
                const point ={
                    latitude: result[0].latitude,
                    longitude: result[0].longitude
                };
                //console.log(point);
                return resolve(point);
            })
            .catch((error)=>{
                return reject(error);
            });
    });
};

//Insert a new location details 
//Inputs payLoad object and a callback function
//modify address format
const createLocation = (payLoad, callback)=>{
    let address = {
        address_line_1: payLoad.address_line_1,
        address_line_2: payLoad.address_line_2,
        addres_type: payLoad.address_type,
        city: payLoad.city,
        state: payLoad.state,
        zipcode: payLoad.zipcode,
        country: payLoad.country
    };
    var locMod = {address: address.city+', '+address.state+', '+address.zipcode+', '+'USA'};

    getLongLat(locMod)
        .then((point)=>{
            let sql = `INSERT INTO address (address_type, address_line_1, address_line_2, city, state, country, zipcode, latitude, longitude) VALUES ('${payLoad.address_type}', '${payLoad.address_line_1}', '${payLoad.address_line_2}','${payLoad.city}', '${payLoad.state}', '${payLoad.country}', '${payLoad.zipcode}', ${point.latitude}, ${point.longitude})`;
            mysqlConnection.query(sql,(err, result)=>{
                if(err){
                    return callback(err);
                 }
                //console.log(result);
                var insertId = result.insertId+'';
                console.log('Last insert ID:', insertId);
                return callback(null,insertId);
            });
        })
        .catch((error)=>{
            return callback(error);
        });
};

//Update the location details of a user
//Inputs userID, payLoad object, and a callback function
const updateLocation = (userID, payLoad, callback)=>{
    let address = {
        address_line_1: payLoad.address_line_1,
        address_line_2: payLoad.address_line_2,
        address_line_3: payLoad.address_line_3,
        addres_type: payLoad.address_type,
        city: payLoad.city,
        state: payLoad.state,
        zipcode: payLoad.zipcode,
        country: payLoad.country
    };
    getLongLat(address)
        .then((point)=>{
            let sql = `UPDATE address, user SET address_type = '${payLoad.address_type}', address_line_1 = '${payLoad.address_line_1}', address_line_2 = '${payLoad.address_line_2}', address_line_3 = '${payLoad.address_line_3}', city = '${payLoad.city}', state = '${payLoad.state}', country = '${payLoad.country}', zipcode = '${payLoad.zipcode}', latitude = ${point.latitude}, longitude = ${point.longitude} WHERE address.id = user.address_id_fk and user.id = ${userID}`;
            mysqlConnection.query(sql,(err, result)=>{
                if(err){
                    return callback(err);
                 }
                //console.log(result);
                return callback(result);
            });
        })
        .catch((error)=>{
            return callback(error);
        });
};



//Calculate distance between two points using Great Circle Formula
//Inputs two points and a callback function
const distanceCalculation = function(point1, point2, callback){
    function toRad(x) {
        return x * Math.PI/180
    }
    var lat1 = (point1.latitude);
    var lat2 = (point2.latitude);
    var lon1 = (point1.longitude);
    var lon2 = (point2.longitude);

    var R = 3958.8 // earth's mean radius in miles
    var phi1 = toRad(lat1);
    var phi2 = toRad(lat2) ;
    var delPhi = toRad(lat2 - lat1);
    var delLambda = toRad(lon2 - lon1);

    var a = Math.sin(delPhi/2) * Math.sin(delPhi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(delLambda/2) * Math.sin(delLambda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; 
    return callback(d);
};


/*
//Done
const getZipCodePr = (addressID)=>{
    return new Promise((resolve, reject)=>{
        let sql = `SELECT zipcode FROM address WHERE address.id = ${addressID}`
        mysqlConnection.query(sql,(err, result)=>{
            if(err){
                return reject(err);
            } 
            //console.log(result[0].zipcode);
            return resolve(result);
        });
    });
}

//Done
const getLongLatPr = (addressID) =>{
    return new Promise((resolve, reject) =>{
        getZipCodePr(addressID)
            .then((result)=>{
                let zipCode = result[0].zipcode;
                let address = zipCode +', USA';
                geoCoder.geocode(address)
                    .then((rest) =>{
                        const point = {
                            latitude: rest[0].latitude,
                            longitude: rest[0].longitude
                        };
                        //console.log(point);
                        return resolve(point);
                    })
                    .catch((error)=>{
                        return reject(error);
                    });
            })
            .catch((error)=>{
                reject(error);
            });
    });
};

//Done
const addLongLatPr = function(addressID, callback){
    getLongLatPr(addressID)
        .then((point)=>{
            //console.log(point);
            long = point.longitude;
            lat = point.latitude;
            let sql = `UPDATE address set longitude = ${long}, latitude = ${lat} WHERE address.id = ${addressID}`;
            mysqlConnection.query(sql,(error, rlt)=>{
                if(error){
                    return callback(error);
                }
                //console.log(result);
                return callback(rlt);
            });
        })
        .catch((err)=>{
            return callback(err)
        })
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
        return callback(result);
    });
};




//Add longitude and latitude to the address table whenever there is a new address created or any update to the address
//Inputs address id and a callback function


const addLongLat = function(addressID, callback){
    getLongLat(addressID, (err, point)=>{
        if(err){
            return callback(err);
        }
        console.log(point);
        long = point.longitude;
        lat = point.latitude;
        let sql = `UPDATE address set longitude = ${long}, latitude = ${lat} WHERE address.id = ${addressID}`;
        mysqlConnection.query(sql,(error, rlt)=>{
            if(err){
                return callback(error);
            }
            //console.log(result);
            return callback(rlt);
        });
    });
};

/*
const addLongLat = function(addressID, callback){
    let sql = `SELECT zipcode FROM address WHERE address.id = ${addressID}`
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
                console.log('AddressID: '+addressID,point);
                let stmt = `UPDATE address set longitude = ${point.longitude}, latitude = ${point.latitude} WHERE address.id = ${addressID}`;
                mysqlConnection.query(stmt,(err, rlt)=>{
                    if(err){
                        return callback(err);
                    }
                    //console.log(result);
                    return callback(rlt);
                });
            })
            .catch((error)=>{
                return callback(error);
            });
    });
        
};


//Get the location latitude and longitude according to the zipcode for a user
//Inputs addressID and a callback function
const getLongLat = function(addressID, callback){
    let sql = `SELECT zipcode FROM address WHERE address.id = ${addressID}`
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
*/

module.exports = {
    getLocation,
    getLongLat,
    createLocation,
    updateLocation,
    distanceCalculation
};