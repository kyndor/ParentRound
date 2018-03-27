var db = require('../helpers/db.js');
// var md5 = require('md5');
const func = {}

func.parentinfo=(d, cb)=>{
	db.query('SELECT * FROM parents WHERE school_id = '+d.school_id, cb);
}

module.exports = func;
