"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({

    email: {
        type: String, 
        unique: true
    },
    password: String,
});

userSchema.statics.hashPassword = function(password){

    return bcrypt.hash(password, 10);
}

const User = mongoose.model("User", userSchema);

module.exports = User;