const mysqlConnection = require("../../connection");
const addressModel = require('./address.model');

//get so_location by service provider id
const getSOLocation = (SPID, callback)=>{
    let sql = `SELECT address_id_fk from so_location WHERE service_provider_id_fk = ${SPID}`;
    mysqlConnection.query(sql, (err, result)=>{
        if(err){
            return callback(err);
        }
        //console.log(result);
        addressID = result[0].address_id_fk;
        addressModel.getAddressByID(addressID, (err, result)=>{
            if(err){
                return callback(err);
            }
            return callback(result);
        });
    });
};

//create sr location by SPID
const createSOLocation = (SPID, payLoad, callback)=>{
    let addressPayload = {
        address_line_1: payLoad.service_address_line_1,
        address_line_2: payLoad.service_address_line_2,
        address_type: 'service',
        city: payLoad.service_city,
        state: payLoad.service_state,
        zipcode: payLoad.service_zipcode,
        country:'United State',
        radius: payLoad.radius //radius is needed for the SO matching
    };
    addressModel.createLocation(addressPayload, (err, addressID)=>{
        if(err){
            return callback(err);
        }
        let sql = `INSERT INTO so_location (address_id_fk, service_provider_id_fk, radius) VALUES (${addressID}, ${SPID}, ${addressPayload.radius})`;
        mysqlConnection.query(sql, (err, result)=>{
            if(err){
                return callback(err);
            }
            let insertID = result.insertID;
            console.log('Record inserted in sr_location table, id: ', insertID);
            return callback(insertID);
        });
    });
};


module.exports = {
    getSOLocation,
    createSOLocation
};