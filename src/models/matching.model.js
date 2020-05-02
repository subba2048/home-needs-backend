const mysqlConnection = require("../../connection");
const locationModel = require("./location.model");

//get the result from service offer table where it is of the same service type (service type given) and available to match.
//if emergency is true, go to the corresponding  service provider and check if they provide emergency service and if they have do not disturb on.
//^^ this will require join operation among services, service provider, and service offer where service provider id will be the same service id should be same
//Also to get the location for the we will also require to join user and address with ^^ two as well where user id and the address id will be the same.
//Have to look into Schedule module.

//location object {city: '', state: '', zipcode: }, emergency a boolean, callback function
//add servicesid after the schedule matching part is done.

const getMatching = (payLoad) => {
    return new Promise((resolve, reject) => {
        const service_id = payLoad.service_id;
        const emergency = payLoad.emergency;
        const location = payLoad.location;
        const datePayload = payLoad.date;
        const timePayload = payLoad.time;
        //check with which attributes needed for this join for quotes and jobs
        //user_id, service_request_id_fk, service_offer_id_fk, service_provider_name, service_title, price_range, job confirmed
        let sql = `SELECT user.id as user_id, service_provider.id as service_provider_id, service_offer.id as service_offer_id_fk, user.full_name as service_provider_name, title as service_title, price_range, longitude, latitude, radius, start_time, end_time, day FROM user, address, services, service_provider, service_offer, so_location, so_schedule where user.id = service_provider.user_id_fk and address.id = user.address_id_fk and service_provider.id = service_offer.service_provider_id_fk and services.id = service_offer.services_id_fk and service_provider.id = so_location.service_provider_id_fk and service_offer.id = so_schedule.service_offer_id_fk and status = 'active' and available_to_match = 1 and do_not_disturb = 0 and services.id = ${service_id}`;
        if (emergency) {
            sql = sql + ` and provides_emergency_service = 1`;
        }
        locMod = { address: location.city + ', ' + location.state + ', ' + location.zipcode + ', ' + 'USA' };
        console.log(locMod);
        mysqlConnection.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.length == 0) {
                return resolve([]);
            }
            let screened = [];
            locationModel.getLongLat(locMod)
                .then((point1) => {
                    //console.log(point1); //for debugging
                    screenedMatching(result, point1)
                        .then((matchedArray) => {

                            screened = matchedArray;
                            if(screened.length==0){
                                return resolve([]);
                            }
                            // console.log(screened);
                            //Add schedule part below it. I will be passing the array named as screened
                            //Time zone.
                            let j = new Array('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');
                            let d = new Date(datePayload.year, datePayload.month - 1, datePayload.day);
                            //schedule={date: {year: 2020, month: 4, day: 30}, time: {hour: 12, minute: 30, second: 0}, no_of_hours: 4};
                            //requested start and end time 
                            let noOfHours = Number(payLoad['no_of_hours']);
                            let addValue = timePayload.hour + noOfHours;
                            let startTime = Date.parse('01/01/2020' + " " + timePayload.hour + ":" + timePayload.minute + ":" + timePayload.second);
                            let endTime = Date.parse('01/01/2020' + " " + addValue + ":" + timePayload.minute + ":" + timePayload.second);
                            //loop
                            let screened2 = [];
                            screened.forEach((item) => {
                                //db start and end time 
                                let startTimeDB = Date.parse('01/01/2020' + ' ' + item.start_time);
                                let endTimeDB = Date.parse('01/01/2020' + ' ' + item.end_time);
                                let dayi = j[d.getDay()];
                                let daydb = item.day;
                                if ((j[d.getDay()] === item.day) && (startTime >= startTimeDB) && (endTime <= endTimeDB)) {
                                    screened2.push(item);
                                }
                            });
                            //if no match return a string saying no match found.
                            if (screened2.length > 0) {
                                console.log(screened2);
                                return resolve(screened2);
                            }
                            else {
                                return resolve([]);
                            }
                        })
                        .catch((error) => {
                            return reject(error);
                        });
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    });
}

const screenedMatching = (result, point1) => {
    return new Promise((resolve, reject) => {

        var totalCalls = 0;
        let screened = [];
        result.forEach((element) => {
            const point2 = {
                latitude: element.latitude,
                longitude: element.longitude
            }
            locationModel.distanceCalculation(point1, point2, (dist) => {
                console.log(dist)
                if (dist <= element.radius) {
                    screened.push(element);
                }
                totalCalls++;
                if (totalCalls == result.length) {
                    return resolve(screened);
                }
            });
        });
    })
}

//quote table attributes: service_request_id_fk, service_offer_id_fk, service_provider_name, service_title, price_range, service_provider_rating, service_provider_reviews, job_confirmed and also has the userid for ui
//create quote
//array of objects to array of values of objects, the output from the getMatching
const createQuote = (payLoad, callback) => {
    getMatching(payLoad)
        .then((objArr) => {
            if (objArr.length == 0) {
                return callback(null, []);
            }
            let keys = Object.keys(objArr[0]);
            let keysClone = [...keys];
            let rem = keysClone.splice(keysClone.indexOf('user_id'), 1); //pop user_id
            // var attr = keysClone.toString();
            // attr += 'service_request_id_fk';
            var attr = "service_offer_id_fk,service_provider_name,service_title,price_range,service_request_id_fk";
            let arrArr = [];
            let userIds = [];
            let SPIDs = [];
            for (i = 0; i < objArr.length; i++) {
                let objArrMid = [];
                Object.keys(objArr[i]).find((key) => {
                    if (key === 'user_id') {
                        userIds.push(objArr[i][key]);
                    }
                    else if (key === 'service_provider_id') {
                        SPIDs.push(objArr[i][key]);
                    }
                    else if(key !== 'longitude' && key !== 'latitude' && key !== 'day' && key !== 'radius' && key !== 'start_time' && key !== 'end_time'){
                        objArrMid.push(objArr[i][key]);
                    }
                    /*
                    else {
                        objArrMid.push(objArr[i][key]);
                    }
                    */
                });
                //not adding job_confirmed as if we have NotNull in db it will be zero by default as it is a TinyInt.
                objArrMid.push(null);
                arrArr.push(objArrMid);
            };
            console.log(arrArr);
            let sql = `INSERT INTO quote (${attr}) VALUES ?`;
            //job confirmed = 0
            mysqlConnection.query(sql, [arrArr], (err, result) => {
                if (err) {
                    return callback(err);
                }
                else {
                    var insertIds = [];
                    for (let i = result.insertId; i < result.insertId + result.affectedRows; i++) {
                        insertIds.push(i);
                    }
                    console.log(insertIds);
                    let userQuoteIds = [];
                    for (let i = 0; i < insertIds.length; i++) {
                        let comb = {
                            q_id: insertIds[i],
                            user_id: userIds[i],
                            service_provider_id: SPIDs[i]
                        };
                        userQuoteIds.push(comb);
                    }
                    return callback(null, userQuoteIds);
                }
            });
        })
        .catch((error) => {
            return callback(error);
        });

};


const updateQuote = (payLoad, callback) => {
    // let key = Object.keys(payload);
    // let val = Object.values(payLoad);
    //const attr = keys.toString();
    //const vals = vals.toString();
    const quotesArray = payLoad['quotes_array']
    const SRID = payLoad['service_request_id'];
    const d = JSON.parse(quotesArray);
    var sql = '';
    d.forEach(q => {
        var f = q['q_id'];
        sql += `UPDATE quote SET service_request_id_fk = ${SRID} where id = ${f};`;
    });
    //check the value should be in '' or not
    // let sql = `UPDATE quote SET '${key}' = ${val} where id = ${id}`;
    mysqlConnection.query(sql, (err, result) => {
        if (err) {
            return callback(err);
        }
        else {
            var sql2 = "select * from quote where service_request_id_fk = "+SRID+";"
            mysqlConnection.query(sql2, (err, result) => {
                if (err) {
                    return callback(err);
                }
                else {
                    return callback(null,result);
                }
            });
        }
    });
};

//update quote for only one attribute
const updateQuoteWithJobConfirmed = (payLoad, callback) => {

    const ID = payLoad['quoteID'];
    var sql = `UPDATE quote SET job_confirmed = 1 where id = ${ID};`;;

    mysqlConnection.query(sql, (err, result) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null,result);
        }
    });
};


/*
const getMatching = (payLoad, callback)=>{
    const service_id = payLoad.service_id;
    const emergency = payLoad.emergency;
    const location = payLoad.location;
    const schedule = payLoad.schedule;
    //check with which attributes needed for this join for quotes and jobs
    let sql = `SELECT * FROM user, address, services, service_provider, service_offer, so_location, so_schedule where user.id = service_provider.user_id_fk and address.id = user.address_id_fk and service_provider.id = service_offer.service_provider_id_fk and services.id = service_offer.services_id_fk and service_provider.id = so_location.service_provider_id_fk and service_offer.id = so_schedule.service_offer_id_fk and status = 'active' and available_to_match = 1 and do_not_disturb = 0 and services.id = ${service_id}`;
    if (emergency){
        sql = sql + ` and provides_emergency_service = 1`;
    }
    locMod = {address: location.city+', '+location.state+', '+location.zipcode+', '+'USA'};
    console.log(locMod);
    mysqlConnection.query(sql,(err, result)=>{
        if(err){
            return callback(err);
        }
        let screened = [];
        locationModel.getLongLat(locMod)
            .then((point1)=>{
                console.log(point1); //for debugging
                result.forEach((element) => {
                    const point2 = {
                        latitude: element.latitude,
                        longitude: element.longitude
                    }
                    console.log(point2); //for debugging
                    locationModel.distanceCalculation(point1, point2, (dist)=>{
                        console.log(dist)
                        //change 1500 to element.radius
                        if (dist <= 1500){
                            screened.push(element);
                        }
                    });
                });

                console.log(screened);
                //return callback(screened);
                //Add schedule part below it. I will be passing the array named as screened
                //Time zone.
                let j = new Array('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');
                let d = new Date(schedule['date'].year, schedule['date'].month - 1, schedule['date'].day);
                //schedule={date: {year: 2020, month: 4, day: 30}, time: {hour: 12, minute: 30, second: 0}, no_of_hours: 4};
                //requested start and end time 
                let startTime = Date.parse('01/01/2020' + " " +schedule['time'].hour+":"+schedule['time'].minute+":"+schedule['time'].second);
                let endTime = Date.parse('01/01/2020' + " "+`${schedule['time'].hour + schedule['no_of_hours']}`+":"+schedule['time'].minute+":"+schedule['time'].second);
                //loop
                let screened2 = [];
                screened.forEach((item)=>{
                    //db start and end time 
                    let startTimeDB = Date.parse('01/01/2020'+' '+item.start_time);
                    let endTimeDB = Date.parse('01/01/2020'+' '+item.end_time);
                    if ((j[d.getDay()] === item.day) && (startTime >= startTimeDB) && (endTime <= endTimeDB)){
                        screened2.push(item);
                    }
                    //if no match return a string saying no match found.
                });
                console.log(screened2);
                return callback(screened2);
            })
            .catch((error)=>{
                return callback(error);
        });
    });
};
*/


module.exports = {
    getMatching,
    createQuote,
    updateQuote,
    updateQuoteWithJobConfirmed
};