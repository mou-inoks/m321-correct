const amqp = require('amqplib')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const fs = require('fs')

const queue = 'video_conversion_queue';
const RABBITMQ_URL = 'amqp://localhost';

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
async function startConsumer() {
    const conn = await connectToRabbitMQ(RABBITMQ_URL);
    const channel = await conn?.createChannel();

    await channel?.assertQueue(queue, { durable: true });

    console.log('Consommateur démarré et en attente de messages...');

    channel?.consume(queue, async (msg) => {
        if (msg) {
            const {videoPath, resolutions} = JSON.parse(message.content.toString());
            const outputDir = 'converted_videos'

            if(!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);


            try {
                for(const resolution of resolutions) {
                    await convertVideo(videoPath, resolution, outputDir);
                }
                
            } catch (error) {
                console.error('Erreur lors du traitement de la tâche :', error);
            }

            channel.ack(msg);
        }
    });
}

module.exports = {startConsumer};