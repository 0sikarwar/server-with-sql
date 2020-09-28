const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gyanendersingh5@gmail.com',
      pass: '2665@gss'
    }
  });
  
  const mailOptions = {
    from: 'gyanendersingh5@gmail.com',
    to: 'gyanendra.singh@cleartrip.com',
    subject: '',
  };
  
  const sendEmail = (userMail, subjct, type, paylaod, callback)=>{
      mailOptions.to = userMail;
      mailOptions.subject = subjct
      mailOptions[type] = paylaod
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          callback(null, error)
        } else {
          console.log('Email sent: ' + info.response);
          callback(info.response, null)
        }
      });
  }

  module.exports = {
    sendEmail
  }