var db = require('../helpers/db.js');
const func = {}

func.getAllMessages=(cb)=>{
    db.query('SELECT * FROM messages', cb);
}

func.thank=(d,cb)=>{
    var data = {
        school_id:d.school_id,
        thank_to_email:d.thank_to_email,
        message_id:d.msg_id,
        msg_type:d.msg_type,
        from_id:d.thank_from_id,
        to_name:d.to_name,
    };
    db.query('INSERT INTO connection SET ?',data,(e,r)=>{
        cb(e,r);
    });
}

module.exports = func;
