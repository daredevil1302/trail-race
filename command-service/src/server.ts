import app from "./app.js";
import { connectRabbitMQ } from "./rabbitmq.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectRabbitMQ();

  app.listen(PORT, () => {
    console.log(`Command service listening on port ${PORT}`);
  });
};

start();
