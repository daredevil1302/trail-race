import { useEffect, useState } from "react";
import { useUser } from "../context/useUser";
import { useNavigate } from "react-router-dom";
import { queryApi } from "../api/client";

type Race = {
  id: string;
  name: string;
  distance: string;
};

const Races = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching races");
    const fetchRaces = async () => {
      try {
        const res = await queryApi.get<Race[]>("/races");
        setRaces(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch races");
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, []);

  if (loading) return <p>Loading races...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Available Races</h2>
      <ul>
        {races.map((race) => (
          <li key={race.id}>
            {race.name} ({race.distance})
            {user?.role === "Applicant" && (
              <button onClick={() => navigate(`/apply/${race.id}`)}>
                Apply
              </button>
            )}
            {user?.role === "Administrator" && (
              <>
                <button style={{ marginLeft: "8px" }}>Edit</button>
                <button style={{ marginLeft: "8px" }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Races;
