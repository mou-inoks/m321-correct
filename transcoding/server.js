const express = require('express');
const amqp = require('amqplib')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')
const cors = require('cors');

const queue = 'transcoding';
const RABBITMQ_URL = 'amqp://rabbitmq';

const app = express();
const port = 3000;

app.use(cors())

//lien de la video, la résolution, le lien 
function convertVideo(videoPath, resolution, outputDir){
    return new Promise((resolve, rejects) => {
        const outputName = `${path.basename(videoPath, path.extname(videoPath))}_${resolution}.mp4`;
        const outputPath = path.join(outputDir, outputName);
        let size;
        if(resolution === '480p') size = '854x480';
        else if(resolution === '720p') size = '1280x720'
        console.log(`conversion de ${videoPath} en ${resolution}...`)

        ffmpeg(videoPath).outputOptions(['-vf', `scale=${size}`]).output(outputPath).on('end', () => {
            console.log('terminer')
            resolve(outputPath);
        }).on('error', (err) => {
            console.error(`erreur, message: ${err.message}`)
            rejects(err);
        }).run();
    })
}
//Url de connection, le nombre d'essaies
const connectToRabbitMQ = async (url, retries = 5) => {
    let connection;
    while (retries) {
        try {
            connection = await amqp.connect(url);
            console.log('Connexion RabbitMQ réussie');
            return connection;
        } catch (error) {
            console.error('Erreur de connexion à RabbitMQ:', error);
            retries -= 1;
            if (retries === 0) {
                throw new Error('Impossible de se connecter à RabbitMQ après plusieurs tentatives');
            }
            console.log('Nouvelle tentative dans 2 secondes...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};
//méthode pour démarrer le consumer
const startConsumer = async () => {
    const conn = await connectToRabbitMQ(RABBITMQ_URL);
    const channel = await conn?.createChannel();

    await channel?.assertQueue(queue, { durable: true });

    console.log('Consommateur démarré et en attente de messages...');

    channel?.consume(queue, async (msg) => {
        console.log("Message arrivé");
        const file = JSON.parse(msg.content.toString())

        const fileName = file.filename.toString()
        
        // Nom du fichier sans l'extension
        const fileNameWithoutMp4 = fileName.slice(0, -4)
        
        const fileName480p = `${fileNameWithoutMp4}-480.mp4`

        const fileName720p = `${fileNameWithoutMp4}-720.mp4`

        // Execution du transcoding en 480p
        exec(`ffmpeg -i ${file.path} -vf "scale=-2:480" uploads/${fileName480p}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error ${error}`)
                return;
            }

            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`)
        })

        // Execution du transcoding en 720p
        exec(`ffmpeg -i ${file.path} -vf "scale=-2:720" uploads/${fileName720p}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error ${error}`)
                return;
            }

            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`)
        })
    })
}

// Démarre le consumer
startConsumer().catch(console.error);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
