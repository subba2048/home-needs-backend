const LOGIN =
{
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: 'STRING',
    notnull: true
  },
  password: {
    type: 'STRING',
    notnull: true
  },
  user_id_fk: {
    type: 'INTEGER',
    foreignKey: true,
    notnull: true
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