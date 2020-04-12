const ADDRESS = {
    id: {
        type: 'INTEGER',
        primaryKey: true,
        autoIncrement: true
    },
    address_type: {
        type: "ENUM('home','service')"
    },
    address_line_1: {
        type: "STRING"
    },
    address_line_2: {
        type: "STRING"
    },
    address_line_3: {
        type: "STRING"
    },
    city: {
        type: "STRING"
    },
    state: {
        type: "STRING"
    },
    country: {
        type: "STRING"
    },
    zipcode: {
        type: 'INTEGER'
    }
}

const getColumns = function getColumns() {
    return Object.keys(ADDRESS);
}

const getColumnInfo = function getColumnInfo(key) {
    return ADDRESS[key];
}

const getObject = function getObject() {
    return ADDRESS;
}

module.exports = {
    getColumns: getColumns,
    getColumnInfo: getColumnInfo,
    getObject: getObject
}
