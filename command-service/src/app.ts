import express from "express";
import { publishMessage } from "./rabbitmq.js";
import cors from "cors";
import { randomUUID } from "crypto";
import {
  validateRaceCreate,
  validateRaceUpdate,
} from "./helpers/validators.js";
import { auth, Authed, requireRole } from "./auth.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(auth);

//races endpoints
app.post("/races", requireRole("Administrator"), async (req, res) => {
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

  const result = await publishMessage("race-events", {
    type: "RaceCreated",
    payload: race,
  });

  res.status(result.status).json({ message: result.message, race });
});

app.patch("/races/:id", requireRole("Administrator"), async (req, res) => {
  const { id } = req.params;
  const { name, distance } = req.body;

  const error = validateRaceUpdate(name, distance);

  if (error) {
    return res.status(400).json({ error });
  }

  const update = { id, ...(name && { name }), ...(distance && { distance }) };

  const result = await publishMessage("race-events", {
    type: "RaceUpdated",
    payload: update,
  });

  res.status(result.status).json({ message: result.message, race: update });
});

app.delete("/races/:id", requireRole("Administrator"), async (req, res) => {
  const { id } = req.params;

  const result = await publishMessage("race-events", {
    type: "RaceDeleted",
    payload: { id },
  });

  res.status(result.status).json({ message: result.message, id });
});

//application endpoints
app.post(
  "/applications",
  requireRole("Applicant"),
  async (req: Authed, res) => {
    const { firstName, lastName, club, raceId } = req.body;

    if (!firstName || !lastName || !raceId) {
      return res
        .status(400)
        .json({ error: "firstName, lastName and raceId are required" });
    }

    const application = {
      id: randomUUID(),
      firstName,
      lastName,
      club: club || null,
      raceId,
      userId: req.user!.sub,
    };

    const result = await publishMessage("application-events", {
      type: "ApplicationCreated",
      payload: application,
    });

    res.status(result.status).json({ message: result.message, application });
  }
);
app.delete(
  "/applications/:id",
  requireRole("Applicant"),
  async (req: Authed, res) => {
    const { id } = req.params;

    const result = await publishMessage("application-events", {
      type: "ApplicationDeleted",
      payload: { id, userId: req.user!.sub },
    });

    res.status(result.status).json({ message: result.message, id });
  }
);

export default app;
