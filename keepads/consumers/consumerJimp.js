"use strict";

require('dotenv').config({ path: '../.env' });

const jimp = require("jimp");

const connectionPromise = require("./../lib/connectAMQP");
const queueName = "jimp";


async function resizeImage() {

    const conn = await connectionPromise;
    const channel = await conn.createChannel();
    await channel.assertQueue(queueName, {});

    // subscribe to queue
    channel.consume("jimp", async msg => {

        const buffer = msg.content.toString();
        const dataFiles = JSON.parse(buffer);   

        jimp.read('./../public/img/ads/' + dataFiles.photoName)
            .then(lenna => {
                return lenna
                .resize(100, 100)
                .quality(60)
                .write('../public/img/ads/thumb/' + dataFiles.photoName);
            })
            .catch(err => {
                console.error(err);
            });

        //work finish 
        channel.ack(msg);
    });

}

resizeImage();