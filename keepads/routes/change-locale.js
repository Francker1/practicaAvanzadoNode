"use strict";

const express = require("express");
const router = express.Router();

router.get("/:locale", (req, res, next) => {

    const getLocaleFromParam = req.params.locale;
    const pathToBack = req.get('referer');

    res.cookie('keepads-locale', getLocaleFromParam, { maxAge: 1000 * 60 * 60 * 24 * 20 });

    res.redirect(pathToBack);
});

module.exports = router;