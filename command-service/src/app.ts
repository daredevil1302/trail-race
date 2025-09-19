import express from "express";
import { publishMessage } from "./rabbitmq.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "command-service" });
});

app.post("/test", async (_req, res) => {
  await publishMessage("test-queue", { hello: "from command-service" });
  res.json({ status: "sent" });
});

export default app;
