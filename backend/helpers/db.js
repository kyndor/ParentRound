var mysql      = require('mysql');
var config 	   = require('../config.js').mysql;
var connection = mysql.createConnection(config);
 
connection.connect();
module.exports = connection;