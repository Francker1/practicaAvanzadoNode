"use strict";

const express = require('express');
const router = express.Router();
const Ads = require("mongoose").model("Advertisement");


/* GET home page. */
router.get('/', async function(req, res, next) {

  try{

    const name = req.query.name;
    const type = req.query.type;
    const tag = req.query.tag;
    const limit = parseInt( req.query.limit || 150 );
    const skip = parseInt( req.query.skip );
    const sort = req.query.sort || "_id";
    const fields = req.query.fields || "-__v";
    const price = req.query.price;
    
    //filters
    const filters = {};

    if (typeof name     !== "undefined") filters.name   = new RegExp(name, "i");
    if (typeof type     !== "undefined") filters.type   = type;
    if (typeof tag      !== "undefined") filters.tags   = tag;
    if (typeof price    !== "undefined") filters.price  = helperJS.getFilterPricing(price);

    // list by filters:
    const ads = await Ads.list( filters, limit, skip, sort, fields );
    res.render('index', { title: 'KeepAds API', ads });
  }catch(err){

    next(err);
  }
});

module.exports = router;
