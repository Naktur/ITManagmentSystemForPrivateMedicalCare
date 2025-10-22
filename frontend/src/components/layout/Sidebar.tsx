import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";


const navItems = [
  { path: "/dashboard/overview", label: "Dashboard", icon: "🏠" },
  { path: "/dashboard/appointments", label: "Wizyty", icon: "📅" },
  { path: "/dashboard/doctors", label: "Lekarze", icon: "👨‍⚕️" },
  { path: "/dashboard/patients", label: "Pacjenci", icon: "🧍‍♂️" },
  { path: "/dashboard/statistics", label: "Statystyki", icon: "📊" },
  { path: "/dashboard/chat", label: "Chat", icon: "💬" },
  { path: "/dashboard/settings", label: "Ustawienia", icon: "⚙️" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [userName, setUserName] = useState("...");

  useEffect(() => {
    // Pobieramy info o zalogowanym użytkowniku
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me/");
        setUserName(res.data.full_name || res.data.username);
      } catch {
        setUserName("Admin");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="bg-secondary text-white w-64 h-screen fixed left-0 top-0 flex flex-col justify-between">
      <div>
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          🏥 MedCare Admin
        </div>
        <nav className="flex-1 p-3 space-y-2">
          {navItems.map((item) => (
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

      {/* Stopka z nazwą użytkownika i wylogowaniem */}
      <div className="border-t border-gray-700 p-3 text-sm">
        <div className="mb-2">
          👤 <span className="font-semibold">{userName}</span>
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
