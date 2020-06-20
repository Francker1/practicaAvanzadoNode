"use strict";

require('dotenv').config({ path: '../.env' });

const amqplib = require("amqplib");
const connectionPromise = amqplib.connect(process.env.AMQP_CONNECTION_STRING);

module.exports = connectionPromise;