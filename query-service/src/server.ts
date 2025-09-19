import app from "./app.js";
import { connectRabbitMQ, consumeMessages } from "./rabbitmq.js";

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectRabbitMQ();
  await consumeMessages("test-queue");

  app.listen(PORT, () => {
    console.log(`Query service listening on port ${PORT}`);
  });
};

start();
