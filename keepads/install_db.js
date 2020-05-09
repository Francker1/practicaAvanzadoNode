"use strict";

require("dotenv").config();

const dataInit = require("./lib/data_initialize");
const conn = require("./lib/connectDB");
const Ad = require("./models/Advertisement");
const User = require("./models/User");

conn.once("open", async () => {

    /**Initialize collection Advertisements */
    try{

        await initAds();
        await initUsers();
        conn.close();
    }catch(err){

        console.error(`Error: ${err}`);
        process.exit();
    }
});

const initAds = async () => {
    
    await Ad.deleteMany();
    await Ad.insertMany(dataInit);
};

const initUsers = async () => {

    await User.deleteMany();
    await User.insertMany([
        {
            email: "user@example.es",
            password: await User.hashPassword("123456"),
            role: "user"
        },
        {
            email: "admin@example.es",
            password: await User.hashPassword("qwerty"),
            role: "admin"
        },
        {
            email: "user2@example.es",
            password: await User.hashPassword("123456"),
            role: "user"
        },
    ]);
}
