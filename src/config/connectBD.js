// get the client

import mysql from 'mysql2/promise';

// const mysql =require('mysql2/promise')
// create the connection to database

// dung pool ddeer ko phair loaf lieen tuwch 
const pool = mysql.createPool({
    host: 'containers-us-west-142.railway.app',
    user: 'root',
    port: '5830',
    password: 'nAyvwubgCLGvwNVFECoM',
    database: 'renApp'
});
export default pool;
// simple query
// connection.query(
//   'SELECT * FROM `user` ',
//   function(err, results, fields) {
//     console.log('mysql')
//     console.log(results); // results contains rows returned by server
//     console.log(results[0]); // results contains rows returned by server
//     // console.log(fields); // fields contains extra meta data about results, if available
//   }
// );