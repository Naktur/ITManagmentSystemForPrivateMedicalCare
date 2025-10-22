import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import AppointmentsPage from "./AppointmentsPage";
import DoctorsPage from "./DoctorsPage";
import PatientsPage from "./PatientsPage";
import SettingsPage from "./SettingsPage";
import OverviewPage from "./OverviewPage";
import StatisticsPage from "./StatisticsPage";
import ChatPage from "./ChatPage";
import ReceptionistsPage from "./ReceptionistsPage";

export default function Dashboard() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="overview" />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="receptionists" element={<ReceptionistsPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="settings" element={<SettingsPage />} />
        
      </Routes>
    </Layout>
  );
}
