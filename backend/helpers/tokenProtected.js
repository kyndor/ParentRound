/*
	THIS FILE CONTAINS THE MIDDLE WARE FUNCTION FOR EXPRESS ROUTES
	Please reffer to routes.js for a possible implementation example
*/

const jwt        = require('jsonwebtoken');
const helpers 	 = require('../helpers');
const config     = require('../config.js');
module.exports = function(req,res,next){
	try{
		var token = req.headers['x-access-token'];
		if(token){
			var verifiedData = jwt.verify(config.jwtHeader+token,config.jwtSecret);
			 req.userData = verifiedData;
			 next();
		}
		else{
			throw new Error('Expired session. Please login and try again.');
		}
	}
	catch(e){
		helpers.resError(res,e);
	}
}
