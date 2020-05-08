"use strict";

class PrivateController{

    index(req, res, next) {

        res.render('profile');
    }
}

module.exports = new PrivateController();