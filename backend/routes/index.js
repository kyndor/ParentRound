const Joi        = require('joi');
const jwt        = require('jsonwebtoken');
const Fuse        = require('fuse.js');
const request = require("request");
const config     = require('../config.js');
const helpers	 = require('../helpers');
const controller = require('../controller');
const jwtProtected = require('../helpers/tokenProtected.js');
const passport = require('passport');
// const nodemailer = require('nodemailer');

const routes = (app)=>{

    app.get('/',(req,res)=>{
        // ask the user for facebook permission
        var data = {};
        res.render('index',data);
    });

    app.post('/getSchools',jwtProtected,(req,res)=>{
        var post = req.body
        pageno = (post.page) ? post.page : 1
        try{
            console.log(Object.keys(post).length)
            if(Object.keys(post).length > 0){

                var allschool = (controller.schools.allSchools)
                function filterData(aschool){
                    if(post.school_name && post.school_zip){
                        var thezip = (aschool.school_zip).toString()
                        var chkzip = (post.school_zip).toString()
                        var theschool = (aschool.school_name).toLowerCase()
                        var chkname = (post.school_name).toLowerCase()
                        return ((thezip.startsWith(chkzip)) && (theschool.includes(chkname)))
                    }
                    else{
                        if(post.school_name){
                            var theschool = (aschool.school_name).toLowerCase()
                            var chkname = (post.school_name).toLowerCase()
                            return (theschool.includes(chkname))
                        }
                        if(post.school_zip){
                            var thezip = (aschool.school_zip).toString()
                            var chkzip = (post.school_zip).toString()
                            return (thezip.startsWith(chkzip))
                        }
                    }
                }
                var returnvar = allschool.filter(filterData)
                var returnData = {}
                if(returnvar.length > 30){
                    var skipData = 30 * (pageno - 1)
                    returnData.data = returnvar.slice(skipData,(skipData + 30))
                    returnData.totalPages = Math.ceil(returnvar.length / 30)
                    returnData.currentPage = parseInt(pageno)
                }
                else{
                    returnData.data = returnvar
                    returnData.totalPages = 1
                    returnData.currentPage = 1
                }
                helpers.resSuccess(res, returnData);
            }
            else{
                throw new Error('Requires zip code and/or school name');
            }
        }
        catch(e){
            helpers.resError(res,e);
        }
    });

    app.post('/getMessages',jwtProtected,(req,res)=>{
        try{
            controller.messages.getAllMessages((e,r)=>{
                if(e){
                    helpers.resError(res,e);
                }
                else{
                    r = JSON.parse(JSON.stringify(r));
                    // console.log(r);
                    helpers.resSuccess(res,r);
                }
            });
        }
        catch(e){
            console.log(e.message);
            helpers.resError(res,e);
        }
    });

    app.post('/getTeachers',jwtProtected,(req,res)=>{
        var post = req.body
        var schema = {
            school_id:Joi.string().required()
        };
        try{
            var validation = Joi.validate(post, schema);
            if(validation.error){
                var errMsg = validation.error.details[0].message
                // errMsg = errMsg.replace('"', "'");
                console.log(errMsg)
                throw new Error(errMsg);
            }
            post = validation.value;

            controller.teacher.getTeachers(post, (e,r)=>{
                if(e){
                    helpers.resError(res,e);
                }
                else{
                    r = JSON.parse(JSON.stringify(r));
                    console.log(r);
                    helpers.resSuccess(res,r);
                }
            });
        }
        catch(e){
            console.log(e.message);
            helpers.resError(res,e);
        }
    });

    app.post('/getParents',jwtProtected,(req,res)=>{
        var post = req.body
        var schema = {
            school_id:Joi.string().required()
        };
        try{
            var validation = Joi.validate(post, schema);
            if(validation.error){
                throw new Error(validation.error.details[0].message);
            }
            post = validation.value;

            controller.parents.parentinfo(post, (e,r)=>{
                if(e){
                    helpers.resError(res,e);
                }
                else{
                    r = JSON.parse(JSON.stringify(r));
                    console.log(r);
                    helpers.resSuccess(res,r);
                }
            });
        }
        catch(e){
            console.log(e.message);
            helpers.resError(res,e);
        }
    });

    app.post('/login',(req,res)=>{
        var post = req.body;
        var schema = {
            email:Joi.string().email().required(),
            password:Joi.string().required()
        };
        try{
            var validation = Joi.validate(post, schema);
            if(validation.error){
                throw new Error(validation.error.details[0].message);
            }
            post = validation.value;

            controller.users.login(post,(e,r)=>{
                if(e){
                    helpers.resError(res,e);
                }
                else{
                    controller.schools.searchschool()
                    r = JSON.parse(JSON.stringify(r));
                    delete r.password;
                    console.log(r);
                    // var token = jwt.sign(r, config.jwtSecret);
                    var token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: r
                    }, config.jwtSecret);
                    helpers.resSuccess(res,{token:helpers.makeHeadless(token)});
                }
            });
        }
        catch(e){
            console.log(e.message);
            helpers.resError(res,e);
        }
    });

    app.post('/thanks',jwtProtected,(req,res)=>{
        var post = req.body;
        if(post.msg_type == 'school'){
            var schema = {
                school_id:Joi.number().required(),
                // thank_to_email:Joi.string().email().required(),
                msg_id:Joi.number().optional(),
                msg_type:Joi.string().required(),
                // to_name:Joi.string().optional(),
                'g-recaptcha-response': Joi.string().required()
            }
            }
        else {
            var schema = {
                school_id:Joi.number().required(),
                thank_to_email:Joi.string().email().required(),
                msg_id:Joi.number().optional(),
                msg_type:Joi.string().required(),
                to_name:Joi.string().optional(),
                'g-recaptcha-response': Joi.string().required()
            }
            }
        try{
            var validation = Joi.validate(post, schema);
            if(validation.error){
                throw new Error(validation.error.details[0].message);
            }
            post = validation.value;
            post.thank_from_id = req.userData.data.user_id
            console.log(post.thank_from_id)

            var options = {
                method: 'POST',
                url: 'https://www.google.com/recaptcha/api/siteverify',
                headers: {
                    'cache-control': 'no-cache',
                    'content-type': 'application/x-www-form-urlencoded'
                },
                form:{
                    secret: '6LdBxzcUAAAAALSGqZBYXLV7V6tcFh3DwhHfbx-a',
                    response: post['g-recaptcha-response']
                }
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                var myres = JSON.parse(body)
                if((myres.success) == true){

                    // send email the proceed
                    controller.messages.thank(post,(e,r)=>{
                        if(e){
                            helpers.resError(res,e);
                        }
                        else{
                            r = JSON.parse(JSON.stringify(r));
                            console.log(r);
                            helpers.resSuccess(res);
                        }
                    });
                }
                else{
                    helpers.resError(res, {
                        "success": false,
                        "message": "recaptcha error."
                    });
                }
            });
        }
        catch(e){
            console.log(e.message);
            helpers.resError(res,e);
        }
    });

    app.post('/signup',(req,res)=>{
        var post = req.body;
        var schema = {
            name:Joi.string().required(),
            email:Joi.string().email().required(),
            password:Joi.string().min(6).required(),
            'g-recaptcha-response': Joi.string().required(),
            join_group: Joi.string().optional()
        };
        try{
            var validation = Joi.validate(post, schema);
            if(validation.error){
                throw new Error(validation.error.details[0].message);
            }
            post = validation.value;

            var options = {
                method: 'POST',
                url: 'https://www.google.com/recaptcha/api/siteverify',
                headers: {
                    'cache-control': 'no-cache',
                    'content-type': 'application/x-www-form-urlencoded'
                },
                form:{
                    secret: '6LdBxzcUAAAAALSGqZBYXLV7V6tcFh3DwhHfbx-a',
                    response: post['g-recaptcha-response']
                }
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                var myres = JSON.parse(body)
                //                console.log(myres);
                //                console.log(myres.success);
                if((myres.success) == true){
                    controller.users.createUser(post,(e,r)=>{
                        if(e){
                            helpers.resError(res,e);
                        }
                        else{
                            controller.schools.searchschool()
                            helpers.resSuccess(res,{});
                        }
                    });
                }
                else{
                    helpers.resError(res, {
                        "success": false,
                        "message": "recaptcha error."
                    });
                }
            });
        }
        catch(e){
            // console.log(e.message);
            helpers.resError(res,e);
        }

    });

    app.post('/resetPassword',(req,res)=>{
        var post = req.body;
        var schema = {
            email:Joi.string().email().required()
        };
        try{
            var validation = Joi.validate(post, schema);
            if(validation.error){
                throw new Error(validation.error.details[0].message);
            }
            post = validation.value;

            controller.users.forgotPass(post,(e,r)=>{
                if(e){
                    helpers.resError(res,e);
                }
                else{
                    helpers.resSuccess(res,r);
                }
            });
        }
        catch(e){
            console.log(e.message);
            helpers.resError(res,e);
        }
    });

    app.post('/withFacebook',(req,res)=>{
        var post = req.body;
        var schema = {
            name:Joi.string().required(),
            email:Joi.string().email().required(),
            password:Joi.string().min(6).required(),
            // 'g-recaptcha-response': Joi.string().optional(),
            join_group: Joi.string().optional()
        };
        try{
            var validation = Joi.validate(post, schema);
            if(validation.error){
                throw new Error(validation.error.details[0].message);
            }
            post = validation.value;

            controller.users.forfacebook(post,(e,r)=>{
                if(e){
                    helpers.resError(res,e);
                }
                else{
                    controller.schools.searchschool()
                    r = JSON.parse(JSON.stringify(r));
                    var token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: r
                    }, config.jwtSecret);
                    helpers.resSuccess(res,{token:helpers.makeHeadless(token)});
                }
            });
        }
        catch(e){
            // console.log(e.message);
            helpers.resError(res,e);
        }

    });

    app.post('/topThanked',(req,res)=>{
        var post = req.body;
        var schema = {
            school_id:Joi.string().required(),
        };
        try{
            var validation = Joi.validate(post, schema);
            if(validation.error){
                throw new Error(validation.error.details[0].message);
            }
            post = validation.value;

            controller.users.topThanked(post, (e,r)=>{
                if(e){
                    helpers.resError(res,e);
                }
                else{
                    helpers.resSuccess(res,r);
                }
            });
        }
        catch(e){
            helpers.resError(res,e);
        }
    })

}

module.exports = routes;
