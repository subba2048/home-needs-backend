const mysqlConnection = require("../../connection");

const getServices = function(callback){
    const sqlQuery = `WITH RECURSIVE category_path (id, title, path) AS
        (
        SELECT id, title, title as path
            FROM services
            WHERE services_id_parent_fk IS NULL
        UNION ALL
        SELECT c.id, c.title, CONCAT(cp.path, ' > ', c.title)
            FROM category_path AS cp JOIN services AS c
            ON cp.id = c.services_id_parent_fk
        )
        SELECT * FROM category_path
        ORDER BY path;`;

    mysqlConnection.query(sqlQuery,(err, rows, fields)=>{
        if(err) return callback(err);
        return callback(null,rows);
    });
};

const getUserByCategory = function(parentID,callback){
    mysqlConnection.query("select * from services where services_id_parent_fk = "+parentID+";",(err, rows, fields)=>{
        if(!err){
            return callback(null,rows);
        }else{
            return callback(err);
        }
    })
};

module.exports = {
    getServices: getServices,
    getUserByCategory: getUserByCategory
};