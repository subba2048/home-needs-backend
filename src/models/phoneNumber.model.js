const mysqlConnection = require("../../connection");

const getPhoneNumbersByUserID = function (userID, callback) {
    const dqlQuery = "select p.phone_number,pt.type from phone_number as p,phone_number_type as pt where user_id_fk = " + userID + " and p.phone_number_type_id_fk = pt.id;";
    mysqlConnection.query(sqlQuery, (err, rows, fields) => {
        if (!err) {
            return callback(null, rows);
        } else {
            return callback(err);
        }
    })
};

const deletePhoneNumberByUserID = function (userID, callback) {
    const sqlQuery = "delete from phone_number where user_id_fk = " + userID + ";";
    mysqlConnection.query(sqlQuery, (err, rows, fields) => {
        if (!err) {
            console.log(`Deleted ${rows.affectedRows} row(s)`);
            return callback(null, rows);
        } else {
            return callback(err);
        }
    })
};

const updatePhoneNumbersByUserIDAndType = function (payLoad, callback) {
    const user_id_fk = payLoad['user_id_fk'];
    const phone_number_type_id_fk = payLoad['phone_number_type_id_fk'];
    const phone_number = payLoad['phone_number'];
    const sqlQuery = "update phone_number set phone_number = '" + phone_number + "' where phone_number_type_id_fk = " + phone_number_type_id_fk + " and user_id_fk = " + user_id_fk + ";";
    mysqlConnection.query(sqlQuery, (err, rows, fields) => {
        if (!err) {
            console.log(`Changed ${rows.changedRows} row(s)`);
            return callback(null, rows);
        } else {
            return callback(err);
        }
    })
};

const createPhoneNumber = function (payLoad, callback) {
    const phoneNumberType = payLoad['phone_number_type'];
    const userIDFK = payLoad['user_id_fk'];
    const phoneNumber = payLoad['phone_number'];
    var phone_number_type_id_fk;
    if (phoneNumberType == 'home')
        phone_number_type_id_fk = 1;
    else if (phoneNumberType == 'work')
        phone_number_type_id_fk = 2;
    else
        phone_number_type_id_fk = 3;

        const sqlQuery = "insert into phone_number (user_id_fk, phone_number_type_id_fk, phone_number) values (" + userIDFK + ", " + phone_number_type_id_fk + ", '" + phoneNumber + "');";
        mysqlConnection.query(sqlQuery, (err, rows, fields) => {
            if (!err) {
                var insertId = rows.insertId + '';
                console.log('Last insert ID:', insertId);
                return callback(null, insertId);
            } else {
                err['displayMessage'] = 'Invalid Phone Number: This phone number is already registered!';
                return callback(err);
            }
        })
};

const getPhoneNumberTypeFK = function (type, callback) {
    const sqlQuery = "SELECT id FROM phone_number_type where type='" + type + "';"
    mysqlConnection.query(sqlQuery, (err, rows, fields) => {
        if (!err) {
            return callback(null, rows);
        } else {
            return callback(err);
        }
    })
};


module.exports = {
    getPhoneNumbersByUserID: getPhoneNumbersByUserID,
    deletePhoneNumberByUserID: deletePhoneNumberByUserID,
    updatePhoneNumbersByUserIDAndType: updatePhoneNumbersByUserIDAndType,
    createPhoneNumber: createPhoneNumber
};