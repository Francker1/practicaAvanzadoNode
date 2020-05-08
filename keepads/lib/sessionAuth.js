"use strict";

module.exports = function(rolToValidate){


    return function(req, res, next){

        if( !req.session.authUser ){

        res.redirect("/login");
        return;
        }

        next();
    }

}