const nodemailer = require('nodemailer');

const rand_string = () => { //generating unique string for each user
  const len = 10;
  let randStr = '';
  for (let i = 0; i < len; ++i) {
      const ch = Math.floor((Math.random()) * 10) + 1;
      randStr += ch;
  }
  return randStr;
}

const send_email = (email, uniqueString) => {
  var Transport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
      },
  });

  var mailOptions;
  const url = `http://localhost:5000/verify/${uniqueString}`;
  let sender = "Transport CO"
  mailOptions = {
      from: sender,
      to: email,
      subject: "Email confirmation",
      html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
  };

  Transport.sendMail(mailOptions, function(error, response) {
      if (error) {
          console.log(error);
      } else {
          console.log("message sent!");
      }
  })
}

module.exports = { rand_string, send_email }
