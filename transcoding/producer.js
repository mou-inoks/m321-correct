const amqp = require('amqplib')
const queue = 'video_convertion_queue'

const RABBITMQ_URL = 'amqp://rabbitmq:5672';
//methode pour envoyer une mssage a rabbitmq 
export async function sendMessage(videopath) {
    try{
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await conn.createChannel();

        await channel.assertQueue(queue, {durable: true});

        const message = JSON.stringify({ videopath: videopath, resolution: ['480p', '720p'] });
        channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

        console.log(`Tâche envoyée pour l'utilisateur`);

        await channel.close();
        await connection.close();
        
    }catch(err){
        console.error('une erreur est survenue')
    }
}