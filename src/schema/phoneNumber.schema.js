const phoneNumberType={
    1: 'home',
    2: 'work',
    3: 'mobile'
}

const PHONE =
{
  id: {
    type: 'INTEGER',
    primaryKey: true,
    autoIncrement: true
  },
  user_id_fk: {
    type: 'INTEGER',
    foreignKey: true,
    notnull: true
  },
  phone_number_type_id_fk: {
    type: 'INTEGER',
    foreignKey: true,
    notnull: true
  },
  phone_number_type: {
    type: "ENUM('home','work','mobile')",
    notnull: true
  }
}

const getColumns = function getColumns() {
  return Object.keys(PHONE);
}

const getColumnInfo = function getColumnInfo(key) {
  return PHONE[key];
}

module.exports = {
  getColumns: getColumns,
  getColumnInfo: getColumnInfo,
  phoneNumberType: phoneNumberType
}