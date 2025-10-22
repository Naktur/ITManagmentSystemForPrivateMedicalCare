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
import ProtectedRoute from "../components/ProtectedRoute"; // ⬅️ dodane

export default function Dashboard() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="overview" />} />

        <Route
          path="overview"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "doctor", "receptionist", "patient"]}
              element={<OverviewPage />}
            />
          }
        />

        <Route
          path="appointments"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "doctor", "receptionist", "patient"]}
              element={<AppointmentsPage />}
            />
          }
        />

        <Route
          path="doctors"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "receptionist", "patient"]}
              element={<DoctorsPage />}
            />
          }
        />

        <Route
          path="receptionists"
          element={
            <ProtectedRoute allowedRoles={["admin"]} element={<ReceptionistsPage />} />
          }
        />

        <Route
          path="patients"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "doctor", "receptionist", "patient"]}
              element={<PatientsPage />}
            />
          }
        />

        <Route
          path="statistics"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "doctor", "receptionist", "patient"]}
              element={<StatisticsPage />}
            />
          }
        />

        <Route
          path="chat"
          element={<ProtectedRoute allowedRoles={["patient"]} element={<ChatPage />} />}
        />

        <Route
          path="settings"
          element={<ProtectedRoute allowedRoles={["admin"]} element={<SettingsPage />} />}
        />
      </Routes>
    </Layout>
  );
}
