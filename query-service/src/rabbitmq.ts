import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
  channel = await connection.createChannel();
  console.log("Query-service connected to RabbitMQ");
};

export const consumeMessages = async (queue: string) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, (msg) => {
    if (msg) {
      const content = msg.content.toString();
      console.log("Received:", content);
      channel.ack(msg);
    }
  });

  console.log(`Listening for messages on queue: ${queue}`);
};
