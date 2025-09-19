import express from "express";
import { publishMessage } from "./rabbitmq.js";
import { randomUUID } from "crypto";
import {
  validateRaceCreate,
  validateRaceUpdate,
} from "./helpers/validators.js";

const app = express();
app.use(express.json());

const validDistances = ["5k", "10k", "HalfMarathon", "Marathon"];

app.post("/races", async (req, res) => {
  const { name, distance } = req.body;

  const error = validateRaceCreate(name, distance);

  if (error) {
    return res.status(400).json({ error });
  }

  const race = {
    id: randomUUID(),
    name,
    distance,
  };

  await publishMessage("race-events", { type: "RaceCreated", payload: race });

  res.status(201).json(race);
});

app.patch("/races/:id", async (req, res) => {
  const { id } = req.params;
  const { name, distance } = req.body;

  const error = validateRaceUpdate(name, distance);

  if (error) {
    return res.status(400).json({ error });
  }

  const update = { id, ...(name && { name }), ...(distance && { distance }) };

  await publishMessage("race-events", { type: "RaceUpdated", payload: update });

  res.json({ status: "update event sent", race: update });
});

app.delete("/races/:id", async (req, res) => {
  const { id } = req.params;

  await publishMessage("race-events", {
    type: "RaceDeleted",
    payload: { id },
  });

  res.json({ status: "delete event sent", id });
});

export default app;
