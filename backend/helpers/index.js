/*
	THIS FILE CONTAINS ALL	THE COMMON FUNCTIONS THAT WILL BE NEEDED BY OUR APPLICATION
	PLEASE INCLUDE ANY OR ALL MODULES THAT YOUR FUNCTIONS MIGHT DEPEND ON
*/
const config = require('../config.js');
const theFunctions={};

theFunctions.resSuccess = (res,data)=>{
    res.json({success:true, result:data});
}

theFunctions.resError = (res,e)=>{
    emsg = e.message||e
    emsg = emsg.replace(/"/g, '')
    res.json({success:false, error:emsg});
//    res.json({success:false, error:e.message||e});
}

theFunctions.makeHeadless = (token)=>{
    token = token.split('.');
    token = token[1] + '.' + token[2]; // removing the 1st part of the token to make it headless
    return token;
}

module.exports=theFunctions;