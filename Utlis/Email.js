let nodemailer= require('nodemailer');

let sendEmail=async (option)=>{
    //create a transporter: a servics that will send the email like gmail
    // we are going to use mail traper dah msh by send emails bgd bs bkhlne a test yaeny
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        secureConnection: false,
        auth: {
          user: "a02aa2c9ff2943",
          pass: "c2ef79e06da47a"
        },
        tls: {
            ciphers:'SSLv3'
        },
      });
      // define options for email
      let emailOptions= {
        from:"HomeMart Support <support@homeMart.com>",
        to:option.email,
        subject: option.subject,
        text: option.text 
      }
      await transport.sendMail(emailOptions);
}
module.exports= sendEmail;