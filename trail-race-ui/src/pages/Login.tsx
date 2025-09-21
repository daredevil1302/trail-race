import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/client";
import { getUserFromToken } from "../api/auth";
import { useUser } from "../context/useUser";

const Login = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSave = () => {
    setAuthToken(token);
    const u = getUserFromToken(token);
    setUser(u);
    navigate("/");
  };

  return (
    <div>
      <h2>Login (paste JWT)</h2>
      <textarea
        rows={4}
        cols={60}
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <br />
      <button onClick={handleSave}>Save Token</button>
    </div>
  );
};

export default Login;
