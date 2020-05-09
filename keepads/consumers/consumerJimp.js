"use strict";

const Jimp = require("jimp");

const connectionPromise = require("./../lib/connectAMQP");
const queueName = "jimp";


module.exports = async function resizeImage() {
    
    const conn = await connectionPromise;
    const channel = await conn.createChannel();
    await channel.assertQueue(queueName, {});

    // nos suscribimos a una cola
    channel.consume(queueName, msg => {

        //trabajo que corresponda a este workers
        const buffer = msg.content.toString();
        const dataFiles = JSON.parse(buffer);
        
        Jimp.read(dataFiles.path)
            .then(imgThumb => {

                return imgThumb
                .resize(100, 100)
                .quality(100)
                .write(`${dataFiles.publicPath}/thumb/${dataFiles.photoName}`); 
            })
            .catch(err => {

                const error = new Error("No image resized");
                error.status = 404;
                return next(error);
        });

        //y cuando haya terminado 
        channel.ack(msg);
    });

}


