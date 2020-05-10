"use strict";

/**
 * whit env variables: 
 * 
 * Error: connect ECONNREFUSED 127.0.0.1:587
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1134:16) {
  errno: 'ECONNREFUSED',
  code: 'ESOCKET',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 587,
  command: 'CONN'
}
*/
const nodemailer = require("nodemailer");

//email send microservice
const cote = require("cote");

require("dotenv").config();

//email config
const transport = nodemailer.createTransport({
    
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS,
    }
});

const responder = new cote.Responder({ name: 'send email responder' });

responder.on('send email', (req) => {

    const message = {
        from: process.env.ADMIN_EMAIL,
        to: req.to,
        subject: "Login admin",
        html:"Un administrador ha iniciado sesión"
    }

    try{

        transport.sendMail(message, function(error, res){
            if (error){
                console.log(error);
            } else {
                console.log("Email sent");
            }
        });
        
    }catch(err){
        console.log(err);
    }
});