"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./public/img/ads/" });

const helperJS = require("../../public/javascripts/helper");


/**load ads model */
const Advertisement = require("../../models/Advertisement");

/**
 * @swagger
 * /apiv1/ads:
 *  get:
 *      summary: Get all Ads
 *      description: Use to request all advertisements created
 *      produces:
 *         - application/json
 *      responses:
 *       200:
 *         description: Advertisements
 *         schema:
 *         type: json
 */
router.get("/", async (req, res, next) => {
    
    try{

        // filter const:
        const name = req.query.name;
        const type = req.query.type;
        const tag = req.query.tag;
        const limit = parseInt( req.query.limit || 150 );
        const skip = parseInt( req.query.skip );
        const sort = req.query.sort;
        const fields = req.query.fields || "-__v";
        const price = req.query.price;
        
        //filters
        const filters = {};

        if (typeof name     !== "undefined") filters.name   = new RegExp(name, "i");
        if (typeof type     !== "undefined") filters.type   = type;
        if (typeof tag      !== "undefined") filters.tags   = tag;
        if (typeof price    !== "undefined") filters.price  = helperJS.getFilterPricing(price);

        // list by filters:
        const ads = await Advertisement.list( filters, limit, skip, sort, fields );
        res.json(ads);
    }catch(err){

        next(err);
    }
   
});



/**
 * @swagger
 * /apiv1/ads/{id}:
 *  get:
 *      summary: Get Ad by ID
 *      description: Use to request an advertisement by ID
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: path
 *           name: id
 *           description: ID of advertisement
 *      responses:
 *       200:
 *         description: Advertisement by ID
 *         schema:
 *         type: json
 */
router.get("/:id", async (req, res, next) => {

    try{

        const _id = req.params.id;
        const ad = await Advertisement.findOne({ _id });

        if(!ad){
            const err = new Error("Ad Not found");
            err.status = 404;
            next(err);
            return;
        }
        res.json(ad);
    }catch(err){

        next(err);
    }

});


/**
 * @swagger
 * /apiv1/ads:
 *  post:
 *      summary: Create Ad
 *      description: Use this request to create a new advertisement
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: body
 *           name: ad info
 *           description: The advertisement to create
 *           schema:
 *               $ref: '#/definitions/Advertisement'
 *      responses:
 *       201:
 *         description: Created!
 */
router.post("/", upload.single("photo"), async (req, res, next) => {

    try{

        const adDataCreate = req.body;
        adDataCreate.photo = adDataCreate.photo ? adDataCreate.photo : "test_image.jpg";

        const ad = new Advertisement(adDataCreate);

        //save in BD
        const adSaved = await ad.save();

        //if is ok, response code 201 - created
        res.status(201).json(adSaved);
    }catch(err){

        next(err);
    }
});


/**
 * @swagger
 * /apiv1/ads/{id}:
 *  put:
 *      summary: Update Ad by ID
 *      description: Use this request to update an advertisement searched by ID
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: path
 *           name: id
 *           description: ID of advertisement
 *         - in: body
 *           name: ad info
 *           description: The advertisement data to update
 *           schema:
 *               $ref: '#/definitions/Advertisement'
 *      responses:
 *       200:
 *         description: Updated!
 */
router.put("/:id", async (req, res, next) => {

    try{

        const _id = req.params.id;
        const adDataUpdate = req.body;

        const adUpdated = await Advertisement.findOneAndUpdate( 
            { _id }, 
            adDataUpdate, 
            { new: true, useFindAndModify: false } 
        );
        res.status(200).json(adUpdated);
    } catch(err){

        next(err);
    }
});


/**
 * @swagger
 * /apiv1/ads/{id}:
 *  delete:
 *      summary: Delete Ad by ID
 *      description: Use to delete an advertisement by ID
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: path
 *           name: id
 *           description: ID of advertisement
 *      responses:
 *       200:
 *         description: If the operation succeeded
 *         schema:
 *         type: json
 */
router.delete("/:id", async (req, res, next) => {

    try{

        const _id = req.params.id;
        await Advertisement.deleteOne({ _id });
        res.json();
    } catch(err){
        
        next(err);
    }
});

/**
 * @swagger
 * definitions:
 *  Advertisement:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *          type:
 *              type: string
 *          price:
 *              type: integer
 *          photo:
 *              type: string
 *              example: test_image.jpg
 *          tags:
 *              type: array
 *              items:
 *                  type: string
 *              example:
 *                  - work
 *                  - lifestyle
 *              enum:
 *                  - work
 *                  - lifestyle
 *                  - motor
 *                  - mobile
 */

module.exports = router;