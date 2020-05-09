"use strict";

const User = require("../models/User");

class PrivateController{

    async index(req, res, next) {

        const auth = req.session.authUser;
        const _id = auth._id;
        const user = await User.findOne({ _id });

        if( !auth ){

            res.redirect("/login");
            return;
        }

        res.render('profile', { user });
    }
}

module.exports = new PrivateController();