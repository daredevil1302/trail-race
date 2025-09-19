const validDistances = ["5k", "10k", "HalfMarathon", "Marathon"];

export const validateRaceCreate = (name?: string, distance?: string) => {
  if (!name || !distance) {
    return "Both name and distance are required";
  }

  if (!validDistances.includes(distance)) {
    return `Invalid distance. Must be one of: ${validDistances.join(", ")}`;
  }

  return null;
};

export const validateRaceUpdate = (name?: string, distance?: string) => {
  if (!name && !distance) {
    return "At least one field is required";
  }

  if (distance && !validDistances.includes(distance)) {
    return `Invalid distance. Must be one of: ${validDistances.join(", ")}`;
  }

  return null;
};
