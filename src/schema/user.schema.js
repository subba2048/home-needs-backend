const USER = 
  {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: 'STRING'
    },
    first_name: {
      type: 'STRING'
    },
    last_name: {
      type: 'STRING'
    },
    email: {
      type: 'STRING'
    },
    password: {
      type: 'STRING'
    },
    created: {
      type: 'DATE',
      defaultValue: new Date().toISOString().slice(0, 19).replace('T', ' ')
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