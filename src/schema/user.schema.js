const USER = 
  {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: 'STRING',
      notnull: true
    },
    middle_name: {
      type: 'STRING'
    },
    last_name: {
      type: 'STRING',
      notnull: true
    },
    user_type:{
      type: "ENUM('admin', 'customer', 'service_provider')"
    },
    address_id_fk: {
      type: 'INTEGER',
      notnull: true
    },
    email: {
      type: 'STRING',
      notnull: true
    },
    status:{
      type: "ENUM('registered', 'active', 'deleted')"
    },
    user_since: {
      type: 'DATE',
      defaultValue: new Date().toISOString().slice(0, 19).replace('T', ' '),
      notnull: true
    }
  };

const getColumns = function getColumns() {
    return Object.keys(USER);
}

const getColumnInfo = function getColumnInfo(key) {
  return USER[key];
}

module.exports = {
  getColumns: getColumns,
  getColumnInfo: getColumnInfo
}