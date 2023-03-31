const amqp = require('amqplib');
 
const ProducerService = {
  sendMessage: async (queue, message) => {

      // buat connection ke RabbitMQ server.
      const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, {
        durable: true,
      });

      // Kemudian, kirim pesan dalam bentuk Buffer ke queue dengan menggunakan perintah channel.sendToQueue.
      await channel.sendToQueue(queue, Buffer.from(message));

      // tutup koneksi setelah satu detik berlangsung dari pengiriman pesan.
      setTimeout(() => {
        connection.close();
      }, 1000);

  },
};

module.exports = ProducerService;