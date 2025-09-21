import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Races from "./pages/Races";
import Applications from "./pages/Applications";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ApplyForm from "./components/ApplyForm/ApplyForm";

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Races</Link>
        <Link to="/applications">Applications</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Races />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apply/:raceId" element={<ApplyForm />} />
      </Routes>
    </Router>
  );
};

export default App;
