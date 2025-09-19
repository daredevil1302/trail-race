import amqp from "amqplib";
import { pool } from "./db.js";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
  channel = await connection.createChannel();
  console.log("Query-service connected to RabbitMQ");
};

export const consumeMessages = async (queue: string) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg) {
      const event = JSON.parse(msg.content.toString());

      if (event.type === "RaceCreated") {
        const { id, name, distance } = event.payload;
        await pool.query(
          "INSERT INTO races (id, name, distance) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING",
          [id, name, distance]
        );
        console.log("Inserted race:", event.payload);
      }

      if (event.type === "RaceUpdated") {
        const { id, name, distance } = event.payload;

        if (name) {
          await pool.query("UPDATE races SET name = $1 WHERE id = $2", [
            name,
            id,
          ]);
        }

        if (distance) {
          await pool.query("UPDATE races SET distance = $1 WHERE id = $2", [
            distance,
            id,
          ]);
        }

        console.log("Updated race:", event.payload);
      }

      if (event.type === "RaceDeleted") {
        const { id } = event.payload;
        await pool.query("DELETE FROM races WHERE id = $1", [id]);
        console.log("Deleted race:", id);
      }

      channel.ack(msg);
    }
  });

  console.log(`Listening for messages on queue: ${queue}`);
};
