import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // ✅ 네비게이션 추가
import HomePage from "./pages/HomePage";
// import Dashboard from "./pages/Dashboard";
// import SalesPage from "./pages/SalesPage";
// import ReportsPage from "./pages/ReportsPage";
// import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ 모든 페이지에서 네비게이션 표시 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
