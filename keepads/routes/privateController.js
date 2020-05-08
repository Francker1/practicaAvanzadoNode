"use strict";

class PrivateController{

    index(req, res, next) {

        if( !req.session.authUser ){

            res.redirect("/login");
            return;
        }

        res.render('profile');
    }
}

module.exports = new PrivateController();