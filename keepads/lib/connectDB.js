"use strict";

const mongoose = require("mongoose");

const conn = mongoose.connection;

/**
 * Conection to mongodb
 */
conn.on("open", () => {
    console.log(`conected to MongoDB in ${conn.name}`);
});

/**
 * If error in connection:
 */
conn.on("error", err => {
    console.error(`Connection error ${err}`);
    
    /** close conection */
    process.exit(1);
});

mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

module.exports = conn;