var db = require('../helpers/db.js');
const func = {}

func.getTeachers=(d, cb)=>{
	db.query('SELECT * FROM teacher WHERE school_id = '+d.school_id, cb);
}

module.exports = func;
