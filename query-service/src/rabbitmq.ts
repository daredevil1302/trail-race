import amqp from "amqplib";
import { pool } from "./db.js";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
  channel = await connection.createChannel();
  console.log("Query-service connected to RabbitMQ");
};

export const publishResult = async (
  status: number,
  message: string,
  correlationId: string
) => {
  await channel.sendToQueue(
    "operation-results",
    Buffer.from(JSON.stringify({ status, message })),
    { correlationId }
  );
};

export const consumeMessages = async (queue: string) => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg) {
      const event = JSON.parse(msg.content.toString());

      //race events
      if (event.type === "RaceCreated") {
        try {
          const { id, name, distance } = event.payload;
          await pool.query(
            "INSERT INTO races (id, name, distance) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING",
            [id, name, distance]
          );
          console.log("Inserted race:", event.payload);

          await publishResult(
            201,
            "Race created!",
            msg.properties.correlationId
          );
        } catch (err) {
          console.log("Error creating race", err);
          await publishResult(
            500,
            "Error creating race",
            msg.properties.correlationId
          );
        }
      }

      if (event.type === "RaceUpdated") {
        try {
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
          await publishResult(
            200,
            "Race updated!",
            msg.properties.correlationId
          );
        } catch (err) {
          console.error("Error updating race", err);
          await publishResult(
            500,
            "Error updating race",
            msg.properties.correlationId
          );
        }
      }

      if (event.type === "RaceDeleted") {
        try {
          const { id } = event.payload;
          await pool.query("DELETE FROM races WHERE id = $1", [id]);

          console.log("Deleted race:", id);
          await publishResult(
            200,
            "Race deleted!",
            msg.properties.correlationId
          );
        } catch (err) {
          console.error("Error deleting race", err);
          await publishResult(
            500,
            "Error deleting race",
            msg.properties.correlationId
          );
        }
      }

      //application events
      if (event.type === "ApplicationCreated") {
        try {
          const { id, firstName, lastName, club, raceId, userId } =
            event.payload;

          await pool.query(
            "INSERT INTO applications (id, first_name, last_name, club, race_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
            [id, firstName, lastName, club, raceId, userId]
          );

          console.log("Application created:", event.payload);
          await publishResult(
            201,
            "Application created",
            msg.properties.correlationId
          );
        } catch (err) {
          console.error("Failed to create application:", err);
          await publishResult(
            500,
            "Error creating application",
            msg.properties.correlationId
          );
        }
      }

      if (event.type === "ApplicationDeleted") {
        try {
          const { id, userId } = event.payload;
          await pool.query(
            "DELETE FROM applications WHERE id = $1 AND user_id = $2",
            [id, userId]
          );
          console.log("Application deleted:", id);
          await publishResult(
            200,
            "Application deleted!",
            msg.properties.correlationId
          );
        } catch (err) {
          console.error("Error deleting application", err);
          await publishResult(
            500,
            "Error deleting race",
            msg.properties.correlationId
          );
        }
      }

      channel.ack(msg);
    }
  });

  console.log(`Listening for messages on queue: ${queue}`);
};
