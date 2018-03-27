/*
ONCE YOU ARE READY WITH YOU CONTROLLER MAKE SURE YOU ADD IT TO `./controller/index.js`
to make sure it is exposed from that path to the rest of the application
this fill should typically contain DB querries or 3rd Party API Calls
*/
var db = require('../helpers/db.js');
const sendmail = require('./mail.js');
var md5 = require('md5');
const func = {}
func.createUser=(post,cb)=>{
    if(post.join_group){
        var data = {
            email:post.email,
            name:post.name,
            password:md5(post.password),
            join_group: post.join_group
        }
        }
    else{
        var data = {
            email:post.email,
            name:post.name,
            password:md5(post.password),
            join_group: 'NULL'
        }
        }
    db.query('INSERT INTO users SET ?',data,(e,r)=>{
        sendmail.signupmail(post.email)
        delete post.password;
        cb(e,post);
    });
}

func.login=(post,cb)=>{
    var data = [post.email,md5(post.password)];
    db.query('SELECT * FROM users WHERE email=? AND password = ?',data,(e,r)=>{
        try{
            if(e){
                throw new Error(e);
            }
            if(r.length==0){
                throw new Error('Wrong EMail/password combination');
            }
            cb(e,r[0]);

        }catch(er){
            cb(er);
        }

    });
}

func.forgotPass=(post,cb)=>{
    var newPass = Math.random().toString(36).substring(2)
    var newPass2 = md5(newPass)
    // 'UPDATE users SET password = '+newPass+' WHERE email = "'+post.email+'"'
    // try{
    db.query('UPDATE users SET password = ? WHERE email = ?', [newPass2, post.email], (e,r)=>{
        try{
            if(e){
                throw new Error(e);
            }
            if(r.affectedRows==0){
                throw new Error('EMail address not registered.');
            }
            if(r.affectedRows>0){
                // send mail
                //                let mailOptions = {
                //                    from: 'Reset Password <ThanksGiving>', // sender address
                //                    to: post.email, // list of receivers
                //                    subject: 'Reset password', // Subject line
                //                    // text: 'Your new password is: ', // plain text body
                //                    html: 'Your new password for thanksGiving is: <b>'+newPass+'</b>' // html body
                //                };
                //                
                //                console.log(mailOptions)
                //
                //                sendmail.mailout(mailOptions, (re)=>{
                //                    console.log(re)
                //                    if(re){
                //                        // helpers.resSuccess(res, 'mail sent to: '+post.mailid);
                //                        cb(e = 0,'Your new password has been sent to your email address: '+post.email);
                //                    }
                //                    else{
                //                        // helpers.resError(res, 'failed sending mail to: '+post.mailid);
                //                        throw new Error('Somthing went wrong. Please try again.');
                //                    }
                //                })

                sendmail.forgotPassMail(post.email, newPass)
                cb(e=0, 'Mail has been sent to your registered email id. Please check your mail for further details.')
            }
        }
        catch(e){
            cb(e);
        }
    })
}

func.forfacebook=(post,cb)=>{
    var data = [post.email];
    db.query('SELECT * FROM users WHERE email=?',data,(e,r)=>{
        try{
            if(e){
                throw new Error(e);
            }
            if(r.length==0){
                // insert here

                if(post.join_group){
                    var data = {
                        email:post.email,
                        name:post.name,
                        password:md5(post.password),
                        join_group: post.join_group,
                        fb: 'Yes'
                    }
                    }
                else{
                    var data = {
                        email:post.email,
                        name:post.name,
                        password:md5(post.password),
                        join_group: 'NULL',
                        fb: 'Yes'
                    }
                    }

                db.query('INSERT INTO users SET ?',data,(e,r)=>{
                    sendmail.signupmail(post.email)
                    delete post.password;
                    cb(e,post);
                });
            }
            if(r.length>0){
                cb(e,r[0]);
            }
        }
        catch(er){
            cb(er);
        }

    });
}

func.sendThanksMail=(cb)=>{
    var mailQuery = 'SELECT connection.connection_id, connection.thank_to_email, connection.to_name, messages.message_text, users.name as senderName FROM connection INNER JOIN messages ON connection.message_id=messages.msg_id AND connection.email_sent=1 INNER JOIN users ON connection.from_id=users.user_id'

    db.query(mailQuery,(e,r)=>{
        try{
            if(e){
                throw new Error('query error');
            }
            else{

                if(r.length>0){

                    for(i=0; i<r.length; i++){
                        // send mail
                        var senderName = (r[i].senderName == NULL) ? 'Someone' : r[i].senderName
                        if(r[i].thank_to_email != null){
                            sendmail.thankMail(r[i].thank_to_email, senderName, r[i].message_text)
                        }

                        // update connections
                        var updateQuery = 'UPDATE connection SET email_sent = ? WHERE connection_id = ?'
                        db.query(updateQuery, ['0', r[i].connection_id], (e,r)=>{
                            // nothing
                        })
                    }
                }
            }
        }
        catch(er){
            console.log(er);
        }

    });
}

func.topThanked=(post,cb)=>{
    var dbQuery = 'SELECT thank_to_email, count(*) AS count FROM connection WHERE school_id = '+post.school_id+' GROUP BY thank_to_email ORDER BY COUNT(*) DESC'
    db.query(dbQuery,(e,r)=>{
        try{
            if(e){
                throw new Error(e);
            }
            else{
                if(r.length==0){
                    throw new Error('None in above school have been thanked.');
                }
                else{
                    var topUser = []
                    if(r.length > 5){
                        topUser = r.slice(0,5)
                    }
                    else{
                        topUser = r
                    }

                    var countLoop = 0
                    for(x in topUser){
                        console.log(topUser[x])
                        db.query('SELECT to_name FROM connection WHERE thank_to_email = ? LIMIT 1',[topUser[x].thank_to_email],(e2,r2)=>{
                            console.log(e2)
                            console.log(r2[0].to_name)
                            countLoop++
                            console.log(countLoop)
                            if(e2){
                                topUser[x].name = 'Someone'
                            }
                            else{
                                topUser[x].name = r2[0].to_name
                            }
                        })
                    }

                    var topUserInterval = setInterval(function(){
                        if(countLoop == topUser.length){
                            clearInterval(topUserInterval);
                            cb(e=0,topUser);
                        }
                    }, 300);

                }
            }

        }
        catch(er){
            cb(er);
        }
    });

}

//setInterval(func.sendThanksMail, 86400000); // 86400000 = 24hrs

module.exports = func;
