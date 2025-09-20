import app from "./app.js";
import { connectRabbitMQ, consumeMessages } from "./rabbitmq.js";
import { initDb } from "./initDb.js";

const PORT = process.env.PORT || 4000;

const start = async () => {
  await initDb();
  await connectRabbitMQ();
  await consumeMessages("race-events");
  await consumeMessages("application-events");

  app.listen(PORT, () => {
    console.log(`Query service listening on port ${PORT}`);
  });
};

start();
