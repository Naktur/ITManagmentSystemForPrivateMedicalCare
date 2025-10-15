import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import AppointmentsPage from "./AppointmentsPage";
import DoctorsPage from "./DoctorsPage";
import PatientsPage from "./PatientsPage";
import SettingsPage from "./SettingsPage";

export default function Dashboard() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="appointments" />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}
