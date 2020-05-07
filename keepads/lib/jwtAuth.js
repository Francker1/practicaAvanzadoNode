"use strict";

const jwt = require("jsonwebtoken");

module.exports = function(){

    return (req, res, next) => {

        const getToken = req.get("Authorization") || req.query.token || req.query.token;

        if( !getToken ){

            const error = new Error("No token provided");
            error.status = 401;
            return next(error);
        }

        jwt.verify(getToken, process.env.JWT_SECRET, (err, payload) => {

            if( err ){

                const error = new Error("Invalid token");
                error.status = 401;
                next(error);
                return;
            }
            req.apiAuthUserID = payload._id;
            next();
        });
    }
}