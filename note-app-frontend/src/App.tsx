import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Signup page as default route */}
        <Route path="/" element={<SignupPage />} />

        {/* Placeholder for login route */}
        <Route path="/login" element={<div>Login Page Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;
