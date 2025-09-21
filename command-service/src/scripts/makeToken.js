import jwt from "jsonwebtoken";

// replace with actual UUIDs from your users table
const adminId = "a4715c15-0663-439f-b10f-e9eb184ea40c";
const applicantId = "aa5669cc-fdc4-4a07-a1f2-4d319a3a4b44";

const secret = "dev_secret";

console.log(
  "Admin:",
  jwt.sign({ sub: adminId, role: "Administrator" }, secret)
);
console.log(
  "Applicant:",
  jwt.sign({ sub: applicantId, role: "Applicant" }, secret)
);
