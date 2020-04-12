const LOGIN = 
  {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: 'STRING'
    },
    password: {
      type: 'STRING'
    },
    created: {
      type: 'DATE',
      defaultValue: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
  }

const getColumns = function getColumns() {
  return Object.keys(LOGIN);
}

const getColumnInfo = function getColumnInfo(key) {
return LOGIN[key];
}

module.exports = {
getColumns: getColumns,
getColumnInfo: getColumnInfo
}