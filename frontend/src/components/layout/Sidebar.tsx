
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/dashboard/appointments", label: "Wizyty", icon: "📅" },
  { path: "/dashboard/doctors", label: "Lekarze", icon: "👨‍⚕️" },
  { path: "/dashboard/patients", label: "Pacjenci", icon: "🧍‍♂️" },
  { path: "/dashboard/settings", label: "Ustawienia", icon: "⚙️" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="bg-secondary text-white w-64 h-screen fixed left-0 top-0 flex flex-col">
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
      <button
        className="m-4 p-2 bg-red-500 rounded hover:bg-red-600"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        🚪 Wyloguj
      </button>
    </div>
  );
}
