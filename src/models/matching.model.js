const mysqlConnection = require("../../connection");
const locationModel = require("./location.model");

//get the result from service offer table where it is of the same service type (service type given) and available to match.
//if emergency is true, go to the corresponding  service provider and check if they provide emergency service and if they have do not disturb on.
//^^ this will require join operation among services, service provider, and service offer where service provider id will be the same service id should be same
//Also to get the location for the we will also require to join user and address with ^^ two as well where user id and the address id will be the same.
//Have to look into Schedule module.

//location object {city: '', state: '', zipcode: }, emergency a boolean, callback function
//add servicesid after the schedule matching part is done.
const getMatching = (emergency, location, callback)=>{
    let sql = `SELECT * FROM user, address, services, service_provider, service_offer, so_location, so_schedule where user.id = service_provider.user_id_fk and address.id = user.address_id_fk and service_provider.id = service_offer.service_provider_id_fk and services.id = service_offer.services_id_fk and service_provider.id = so_location.service_provider_id_fk and service_offer.id = so_schedule.service_offer_id_fk and status = 'active' and available_to_match = 1 and do_not_disturb = 0`;
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
                        if (dist <= element.radius){
                            screened.push(element);
                        }
                        //Add schedule part below it. I will be passing the array named as screened.
                    });
                });
                console.log(screened);
                return callback(screened);
            })
            .catch((error)=>{
                return callback(error);
            });
    });
};


module.exports = {
    getMatching
} 