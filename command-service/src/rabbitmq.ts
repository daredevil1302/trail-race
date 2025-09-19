import amqp from "amqplib";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
  channel = await connection.createChannel();
  console.log("Connected to RabbitMQ");
}

export async function publishMessage(queue: string, message: object) {
  if (!channel) throw new Error("RabbitMQ channel is not initialized");
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  console.log("Sent:", message);
}
