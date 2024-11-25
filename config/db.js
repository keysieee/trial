const mysql = require('mysql2/promise'); // Change this line

const pool = mysql.createPool({
    host: 'localhost', // Your database host
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password
    database: 'rj_cgt' // Your database name
});

module.exports = pool;
