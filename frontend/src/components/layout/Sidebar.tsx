import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [userName, setUserName] = useState("...");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me/");
        const role = res.data.role;
        setUserName(res.data.full_name || res.data.username);
        setRole(role);
        localStorage.setItem("userRole", role);
      } catch {
        setUserName("Nieznany");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [
          { path: "/dashboard/overview", label: "Dashboard", icon: "🏠" },
          { path: "/dashboard/appointments", label: "Wizyty", icon: "📅" },
          { path: "/dashboard/doctors", label: "Lekarze", icon: "👨‍⚕️" },
          { path: "/dashboard/receptionists", label: "Recepcjonistki", icon: "🧑‍💼" },
          { path: "/dashboard/patients", label: "Pacjenci", icon: "🧍‍♂️" },
          { path: "/dashboard/statistics", label: "Statystyki", icon: "📊" },
          { path: "/dashboard/settings", label: "Ustawienia", icon: "⚙️" },
        ];
      case "doctor":
        return [
          { path: "/dashboard/appointments", label: "Moje wizyty", icon: "📅" },
          { path: "/dashboard/patients", label: "Pacjenci", icon: "🧍‍♂️" },
          { path: "/dashboard/statistics", label: "Statystyki", icon: "📊" },
        ];
      case "receptionist":
        return [
          { path: "/dashboard/appointments", label: "Wizyty", icon: "📅" },
          { path: "/dashboard/patients", label: "Pacjenci", icon: "🧍‍♂️" },
          { path: "/dashboard/statistics", label: "Statystyki", icon: "📊" },
        ];
      case "patient":
        return [
          { path: "/dashboard/appointments", label: "Moje wizyty", icon: "📅" },
          { path: "/dashboard/chat", label: "Chat", icon: "💬" },
          { path: "/dashboard/statistics", label: "Statystyki", icon: "📊" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="bg-secondary text-white w-64 h-screen fixed left-0 top-0 flex flex-col justify-between">
      <div>
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          🏥 MedCare System
        </div>

        <nav className="flex-1 p-3 space-y-2">
          {getNavItems().map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-primary transition ${
                pathname === item.path ? "bg-primary" : ""
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-700 p-3 text-sm">
        <div className="mb-2">
          👤 <span className="font-semibold">{userName}</span>
          {role && <span className="ml-1 text-gray-400">({role})</span>}
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 rounded p-2 hover:bg-red-600"
        >
          🚪 Wyloguj
        </button>
      </div>
    </div>
  );
}
