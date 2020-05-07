"use strict";

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


class LoginController{

    /**
     * POST /apiv1/loginJWT
     */
    async postJWT(req, res, next){

        try{

            const email = req.body.email;
            const password = req.body.password;

            //search user in BD
            const user = await User.findOne({ email });

            //not user found
            if( !user || !await bcrypt.compare(password, user.password) ){

                const error = new Error("Invalid credentials");
                error.status = 401;
                next(error);
                return;
            }

            //if user exists -> create JWT
            const token = jwt.sign(
                { _id: user._id }, 
                process.env.JWT_SECRET, 
                {expiresIn: "4d"}
            );

            res.json({ token: token});
        }catch(err){

            next(err);
        }
    }

}

module.exports = new LoginController();