var db = require('../helpers/db.js');
const func = {}

func.allSchools=[]
func.searchschool=()=>{
	query = 'SELECT school.school_id, school.school_state, school.school_name, school.school_address, school.school_city, school.school_zip, (select count(*) from connection where school.school_id=connection.school_id) as connection FROM schools AS school'
	db.query(query, (e,r)=>{
		func.allSchools = r
	})
}
func.searchschool()
module.exports = func;
