'use strict';
const nodemailer = require('nodemailer');

const func = {}

func.transporter = nodemailer.createTransport({
    //  host: 'in-v3.mailjet.com',
    //  port: 25,
    //   secure: false, // true for 465, false for other ports
    //    service: "Gmail",
    //    auth: {
    //        user: "tilak@etrixtech.com",
    //        pass: "bunty123" 
    //    }

    service: "SendGrid",
    auth: {
        user: "parentround",
        pass: "Hello090#"
    }

});

func.mailout = (mailOptions, cb)=>{
    // send mail with defined transport object
    func.transporter.sendMail(mailOptions, (error, info) => {
        console.log(error)
        console.log(info)
        if (error) {
            // return console.log(error);
            cb(0)
        }
        else{
            cb(1)
        }
        // console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

func.signupmail = (mailid)=>{
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'info@parentround.com', // sender address
        to: mailid, // list of receivers
        subject: 'Thank you for signing to thanks.parentround', // Subject line
        // text: '', // plain text body
        html: '<h3>Hello Madam/Sir</h3><br/><h2>Welcome to <b>thanks.parentround</b></h2><br/><h3>Regards,<br/>parentround Team</h3>' // html body
    };

    // send mail with defined transport object
    func.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

func.forgotPassMail = (mailid, newpass)=>{
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'info@parentround.com', // sender address
        to: mailid, // list of receivers
        subject: 'Reset password for thanks.parentround', // Subject line
        // text: 'Your new password is: ', // plain text body
        html: 'Your new password for thanksGiving is: <b>'+newpass+'</b>' // html body
    };

    // send mail with defined transport object
    func.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
}

func.thankMail = (sendTo, sender, messageText)=>{
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'info@parentround.com', // sender address
        to: sendTo, // list of receivers
        subject: 'You recveived a thank @ thanks.parentround', // Subject line
        // text: 'Your new password is: ', // plain text body
        html: '<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
        ''+
        '<div style="background-color:transparent;">'+
        '<div style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">'+
        '<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">'+
        ''+
        '<div class="col num12" style="min-width: 320px;max-width: 640px;display: table-cell;vertical-align: top;">'+
        '<div style="background-color: transparent; width: 100% !important;">'+
        '<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">'+
        ''+
        '<div style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">'+
        '<div align="center">'+
        '<div style="border-top: 0px solid transparent; width:100%; line-height:0px; height:0px; font-size:0px;">&nbsp;</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div style="background-color:transparent;">'+
        '<div style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;" class="block-grid ">'+
        '<div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">'+
        '<div class="col num12" style="min-width: 320px;max-width: 640px;display: table-cell;vertical-align: top;">'+
        '<div style="background-color: transparent; width: 100% !important;">'+
        '<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">'+
        '<div align="center" class="img-container center  autowidth " style="padding-right: 0px;  padding-left: 0px;">'+
        '<img class="center  autowidth " align="center" border="0" src="https://www.parentround.com/wp-content/uploads/2017/08/final-logo_2.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;float: none;width: 85%;max-width: 400px;padding-top: 8px;padding-bottom: 8px;" width="400">'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div style="background-image:url(\'https://thanks.parentround.com/mail_img/b1-copy.jpg\');background-position:top center;background-repeat:no-repeat; background-size: 640px 100%; background-color:transparent;">'+
        '<div style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">'+
        '<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">'+
        '<div class="col num12" style="min-width: 320px;max-width: 640px;display: table-cell;vertical-align: top;">'+
        '<div style="background-color: transparent; width: 100% !important;">'+
        '<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:35px; padding-bottom:25px; padding-right: 35px; padding-left: 35px;">'+
        '<div align="center" class="img-container center  autowidth " style="padding-right: 0px;  padding-left: 0px;">'+
        '<img class="center  autowidth " align="center" border="0" src="https://thanks.parentround.com/mail_img/blink.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 60px" width="60">'+
        '</div>'+
        '<div style="font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;line-height:120%;color:#FFFFFF; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">'+
        '<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#FFFFFF;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 28px; line-height: 33px;"><span style="overflow: hidden; line-height: 33px; font-size: 28px;" data-mce-type="bookmark" id="mce_2_start">﻿</span>You have a Thank message</span></p></div>'+
        '</div>'+
        ''+
        '<div style="color:#555555;line-height:150%;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">'+
        '<div style="font-size:12px;line-height:18px;color:#555555;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 18px;text-align: center">﻿<span style="color: rgb(255, 255, 255); font-size: 24px; line-height: 36px;">'+sender+' Thanked You</span></p></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div style="background-color:transparent;">'+
        '<div style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #8AC712;" class="block-grid ">'+
        '<div style="border-collapse: collapse;display: table;width: 100%;background-color:#8AC712;">'+
        '<div class="col num12" style="min-width: 320px;max-width: 640px;display: table-cell;vertical-align: top;">'+
        '<div style="background-color: transparent; width: 100% !important;">'+
        '<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:35px; padding-bottom:60px; padding-right: 0px; padding-left: 0px;">'+
        ''+
        '<div align="center" class="img-container center  autowidth " style="padding-right: 0px;  padding-left: 0px;">'+
        '<img class="center  autowidth " align="center" border="0" src="https://thanks.parentround.com/mail_img/envelope.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 28px" width="28">'+
        '</div>'+
        ''+
        '<div style="font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;line-height:120%;color:#555555; padding-right: 10px; padding-left: 10px; padding-top: 25px; padding-bottom: 0px;">'+
        '<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 28px; line-height: 33px; color: rgb(255, 255, 255);"><strong><span style="line-height: 33px; font-size: 28px; letter-spacing: 1px;">'+messageText+'<br>Thank you</span></strong></span></p></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div style="background-color:transparent;">'+
        '<div style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;" class="block-grid ">'+
        '<div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">'+
        '<div class="col num12" style="min-width: 320px;max-width: 640px;display: table-cell;vertical-align: top;">'+
        '<div style="background-color: transparent; width: 100% !important;">'+
        '<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">'+
        '<div style="font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif;line-height:180%;color:#555555; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">'+
        '<div style="font-size:12px;line-height:22px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 25px;text-align: center"><span style="color: rgb(138, 199, 18); font-size: 22px; line-height: 35px;">Want to say thank you </span><br><span style="color: rgb(138, 199, 18); font-size: 22px; line-height: 35px;">to teacher or School?</span></p></div>'+
        '</div>'+
        ''+
        '<div style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;">'+
        '<div align="center">'+
        '<div style="border-top: 2px solid #6a9d00; width:40%; line-height:2px; height:2px; font-size:2px;">&nbsp;</div>'+
        '</div>'+
        '</div>'+
        ''+
        '<div style="color:#555555;line-height:120%;font-family:\'Lato\', Tahoma, Verdana, Segoe, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">'+
        '<div style="font-size:12px;line-height:14px;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 24px; line-height: 28px;">Visit</span></p></div>'+
        '</div>'+
        ''+
        '<div align="center" class="img-container center fixedwidth" style="padding-right: 0px;  padding-left: 0px;">'+
        '<a href="https://thanks.parentround.com" target="_blank">'+
        '<img class="center fixedwidth" align="center" border="0" src="https://www.parentround.com/wp-content/uploads/2017/08/final-logo_2.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 256px" width="256">'+
        '</a>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div style="background-color:transparent;display:none">'+
        '<div style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #F6F6F6;" class="block-grid ">'+
        '<div style="border-collapse: collapse;display: table;width: 100%;background-color:#F6F6F6;">'+
        '<div class="col num12" style="min-width: 320px;max-width: 640px;display: table-cell;vertical-align: top;">'+
        '<div style="background-color: transparent; width: 100% !important;">'+
        '<div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">'+
        ''+
        '<div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;">'+
        '<div style="line-height:10px;font-size:1px">&nbsp;</div>'+
        '<div style="display: table; max-width:151px;">'+
        ''+
        '<table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px">'+
        '<tbody>'+
        '<tr style="vertical-align: top">'+
        '<td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
        '<a href="https://www.facebook.com/" title="Facebook" target="_blank">'+
        '<img src="https://thanks.parentround.com/mail_img/facebook@2x.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
        '</a>'+
        '<div style="line-height:5px;font-size:1px">&nbsp;</div>'+
        '</td>'+
        '</tr>'+
        '</tbody>'+
        '</table>'+
        '<table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px">'+
        '<tbody>'+
        '<tr style="vertical-align: top">'+
        '<td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
        '<a href="https://twitter.com/" title="Twitter" target="_blank">'+
        '<img src="https://thanks.parentround.com/mail_img/twitter@2x.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
        '</a>'+
        '<div style="line-height:5px;font-size:1px">&nbsp;</div>'+
        '</td>'+
        '</tr>'+
        '</tbody>'+
        '</table>'+
        '<table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0">'+
        '<tbody>'+
        '<tr style="vertical-align: top">'+
        '<td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
        '<a href="https://plus.google.com/" title="Google+" target="_blank">'+
        '<img src="https://thanks.parentround.com/mail_img/googleplus@2x.png" alt="Google+" title="Google+" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
        '</a>'+
        '<div style="line-height:5px;font-size:1px">&nbsp;</div>'+
        '</td>'+
        '</tr>'+
        '</tbody>'+
        '</table>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</td>'
    };

    // send mail with defined transport object
    func.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
}

module.exports = func
