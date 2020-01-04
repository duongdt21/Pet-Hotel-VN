var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your mail',
      pass: 'your pass'
    }
  });
    
  
  sendMail = (toMail,content,subject) => {
    var mailOptions = {
        from: 'your mail',
        to: toMail,
        subject: subject,
        text: content,
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      
  };

  module.exports = sendMail;
  

