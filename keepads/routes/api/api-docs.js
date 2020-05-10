"use strict";

const express = require("express");
const app = express();

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");


//Swagger documentation
const swaggerOptions = {
    swaggerDefinition:{
        info:{
            version: "1.0.0",
            title: "KeepCodingAds API",
            description: "KeepAds API Documentation for use",
            contact:{
                name: "Ítalo Ravina Clemente",
                url: "https://www.linkedin.com/in/italofranco/"
            },
            servers: ["http://localhost:9000"]
        }
    },
    basePath: "/",
    apis: ["./routes/api/ads.js","./routes/loginController.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocs));


module.exports = app;