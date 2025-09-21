import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { commandApi } from "../../api/client";

const ApplyForm = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [club, setClub] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("ušoa");
    e.preventDefault();
    try {
      await commandApi.post("/applications", {
        firstName,
        lastName,
        club: club || undefined,
        raceId,
      });
      alert("Application submitted!");
      navigate("/applications");
    } catch (err) {
      console.error(err);
      alert("Failed to submit application");
    }
  };

  return (
    <div>
      <h2>Apply to Race</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Club (optional):</label>
          <input value={club} onChange={(e) => setClub(e.target.value)} />
        </div>
        <button type="submit">Apply</button>
      </form>
    </div>
  );
};

export default ApplyForm;
