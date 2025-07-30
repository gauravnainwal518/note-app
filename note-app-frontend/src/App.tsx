import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Signup page as default route */}
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/Dashboard" element={<DashboardPage/>} />
      </Routes>
    </Router>
  );
}

export default App;