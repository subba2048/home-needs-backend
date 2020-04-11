const base_url = 'http://127.0.0.1:8000/api';

URLS = {

    /*
     Proxy End Points For User
     */

    'USER': base_url + '/user',
    
    /*
     Proxy End Points For Customer
     */
    'CUSTOMER': base_url + '/customer',

    /*
     Proxy End Points For Schedule
     */
    'SCHEDULE': base_url + '/schedule',

    /*
     Proxy End Points For location
     */
    'LOCATION': base_url + '/location',

    /*
     Proxy End Points For login
     */
    'LOGIN': base_url + '/login',

};


const getUrl = function getUrl(key) {
    return URLS[key];
}

module.exports = {
    getUrl: getUrl
}