"use strict";

const jimp = require("jimp");


//!Sorry, i know connection promise must be throw .env file, but if I do, this document crash
const amqplib = require("amqplib");
const connectionPromise = amqplib.connect("amqp://jtzntaqq:TPNNYqI3H_PSUtCFVDNfOUXEOSsOOvOI@squid.rmq.cloudamqp.com/jtzntaqq");

const queueName = "jimp";


const dataFilesResize = async function resizeImage() {

    const conn = await connectionPromise;
    const channel = await conn.createChannel();
    await channel.assertQueue(queueName, {});

    // subscribe to queue
    channel.consume(queueName, async msg => {

        const buffer = msg.content.toString();
        const dataFiles = JSON.parse(buffer);

        const image = await jimp.read('../public/img/ads/' + dataFiles.photoName);
        await image.resize(100, 100);
        await image.writeAsync('../public/img/ads/thumb/' + dataFiles.photoName);
        

        //work finish 
        channel.ack(msg);
    });

}

dataFilesResize();