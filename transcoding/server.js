/**
 * Service web statique + d'API pour le transcoding
 */

const express = require('express')
const amqp = require('amqplib')
const bodyParser = require('body-parser')
const {startConsumer} = require('./consumer')

const app = express();
const port = 3002;

const RABBITMQ_URL = 'amqp://localhost';
const QUEUENAME = 'video_conversion_queue';

app.use(bodyParser.json());

// Methode de send to queue
async function sendToQueue(videoPath) {
    try{ 
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUENAME, {durable: true});

        const message = JSON.stringify({videoPath});
        channel.sendToQueue(QUEUENAME, Buffer.from(message), {persistent: true});

        console.log('tache envoyée');
        await channel.close();
        await connection.close();
    }catch(err) {
        console.error("Erreur");
    }
}
//post 
app.post('/convert', async (req, res) => {
    const {videoPath} = req.body;

    if(!videoPath) {
        return res.status(400).json({message: 'erreur'})
    }

    try {
        await sendToQueue(videoPath);
        return res.status(200).json({message: 'Send To queue'});
    }catch(err){
        console.error(`Erreur: ${err.message}`);
    }
})

;(async () => {
    console.log("Start consumer...")
    await startConsumer();
})();

app.listen(port, () => {
    console.log("Started");
})