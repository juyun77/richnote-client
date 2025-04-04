// App.js
import { Routes, Route } from "react-router-dom"; // BrowserRouter 삭제
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ExpensePage from "./pages/ExpensePage";
import SalesRecordPage from "./pages/SalesRecordPage";
import StoreRegistration from "./pages/StoreRegistration";
import StoreEditPage from "./pages/StoreEditPage";
import StoreDetailPage from "./pages/StoreDetailPage";
import InventoryPage from "./pages/InventoryPage";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/salesRecord" element={<SalesRecordPage />} />
        <Route path="/store/register" element={<StoreRegistration />} />
        <Route path="/store/:storeId/edit" element={<StoreEditPage />} />
        <Route path="/store/:storeId" element={<StoreDetailPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>
    </>
  );
}

export default App;
