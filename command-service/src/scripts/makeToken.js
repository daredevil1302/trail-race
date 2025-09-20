import jwt from "jsonwebtoken";

const adminToken = jwt.sign(
  { sub: "admin-1", role: "Administrator" },
  "dev_secret"
);
console.log("Admin:", adminToken);

const applicantToken = jwt.sign(
  { sub: "user-1", role: "Applicant" },
  "dev_secret"
);
console.log("Applicant:", applicantToken);
