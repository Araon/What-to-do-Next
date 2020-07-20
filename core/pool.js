const util = require('util');
const mysql = require('mysql');


//connectng with the database server, make sure the server is up and running
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'araon',
    password: 'test',
    database: 'profile'
});
//actual connection to the sql server
pool.getConnection((err, connection) => {
    if(err)
        console.error('Something went wrong while connecting to the database...');
    
    if(connection)
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;