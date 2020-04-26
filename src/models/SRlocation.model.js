const mysqlConnection = require("../../connection");
const locationModel = require('./location.model');

//get sr_location by service request id
const getSRLocation = (SRID, callback)=>{
    let sql = `SELECT address_id_fk from sr_location WHERE service_request_id_fk = ${SRID}`;
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

//create sr location by SRID
const createSRLocation = (SRID, payLoad, callback)=>{
    let addressPayload = {
        address_line_1: payLoad.service_address_line_1,
        address_line_2: payLoad.service_address_line_2,
        address_type: 'service',
        city: payLoad.service_city,
        state: payLoad.service_state,
        zipcode: payLoad.service_zipcode,
        country:'United State'
    };
    locationModel.createLocation(addressPayload, (err, addressID)=>{
        if(err){
            return callback(err);
        }
        let sql = `INSERT INTO sr_location (service_request_id_fk, address_id_fk) VALUES (${SRID}, ${addressID})`;
        mysqlConnection.query(sql, (err, rows)=>{
            if(err){
                return callback(err);
            }
            var insertId = rows.insertId+'';
            console.log('Last inserted ID: ', insertId);
            return callback(null,insertId);
        });
    });
};


module.exports ={
    getSRLocation,
    createSRLocation
};