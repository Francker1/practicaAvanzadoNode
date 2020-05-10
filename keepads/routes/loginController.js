"use strict";

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const cote = require("cote");
const cote = require("cote");

class LoginController{

    /**
     * GET /login
     */
    index(req, res, next) {

       res.locals.email = '';
       res.locals.error = '';
       res.render('login');
    }

    /**
     * POST /login
     */
    async post(req, res, next) {

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });

        if( !user || !await bcrypt.compare(password, user.password) ){

            res.locals.email = email;
            res.locals.error = res.__("Invalid credentials");
            res.render("login");
            return;
        }

        req.session.authUser = {
            _id: user._id,
            role: user.role
        };

        res.redirect("/profile");
        
        if( user.role == "admin"){

            //send email client
            const requester = new cote.Requester({name:"send email requester"})
            const request = { 
                type: 'send email', 
                to: user.email,
            };
 
            requester.send(request);
        }        
    }

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

    /**
     * GET /logout
     */
    logout(req, res, next){

        req.session.regenerate(err => {

            if(err){

                return next(err);
            }

            res.redirect("/");
        });
    }

}

module.exports = new LoginController();