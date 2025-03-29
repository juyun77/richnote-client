import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
// import SalesPage from "./pages/SalesPage";
// import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ExpensePage from "./pages/ExpensePage";
import StoreForm from "./components/StoreForm";
import SalesRecordPage from "./pages/SalesRecordPage";
import StoreRegistration from "./pages/StoreRegistration";
import StoreEditPage from "./pages/StoreEditPage";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar /> {/* 모든 페이지에서 네비게이션 표시 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/sales" element={<SalesPage />} />
        <Route path="/reports" element={<ReportsPage />} /> */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/salesRecord" element={<SalesRecordPage />} />
        <Route path="/store/register" element={<StoreRegistration />} />
        <Route path="/store/:storeId/edit" element={<StoreEditPage />} />
      </Routes>
    </>
  );
}

export default App;
