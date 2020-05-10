"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailerTransport = require("../lib/nodeMailer");


mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({

    email: {
        type: String, 
        unique: true
    },
    password: String,
    role: String,
});

userSchema.statics.hashPassword = function(password){

    return bcrypt.hash(password, 10);
}

//method to save data to send email
userSchema.methods.sendEmail = function(from, subject, body) {

    // enviar el correo
    return nodemailerTransport.sendMail({
      from: from,
      to: this.email,
      subject: subject,
      html: body
    });
  
}

const User = mongoose.model("User", userSchema);

module.exports = User;