import amqp from "amqplib";
import { randomUUID } from "crypto";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
  channel = await connection.createChannel();
  console.log("Connected to RabbitMQ");
}

export async function publishMessage(
  queue: string,
  message: object
): Promise<{ status: number; message: string }> {
  if (!channel) throw new Error("RabbitMQ channel is not initialized");

  await channel.assertQueue(queue, { durable: true });
  await channel.assertQueue("operation-results", { durable: true });

  const correlationId = randomUUID();

  return new Promise((resolve) => {
    channel.consume(
      "operation-results",
      (msg) => {
        if (!msg) return;
        if (msg.properties.correlationId === correlationId) {
          const result = JSON.parse(msg.content.toString());
          resolve(result);
        }
      },
      { noAck: true }
    );

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      correlationId,
      replyTo: "operation-results",
    });
  });
}
