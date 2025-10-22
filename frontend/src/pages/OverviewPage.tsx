import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

interface Appointment {
  id: number;
  patient_name: string;
  doctor_name: string;
  scheduled_at: string;
  status: string;
}

export default function OverviewPage() {
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    upcoming: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole);
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        api.get("/patients/"),
        api.get("/doctors/"),
        api.get("/appointments/"),
      ]);

      const allAppointments: Appointment[] = appointmentsRes.data;
      const upcoming = allAppointments.filter(
        (a) => new Date(a.scheduled_at) > new Date()
      );

      setCounts({
        patients: patientsRes.data.length,
        doctors: doctorsRes.data.length,
        appointments: allAppointments.length,
        upcoming: upcoming.length,
      });

      const sortedUpcoming = upcoming
        .sort(
          (a, b) =>
            new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
        )
        .slice(0, 5);

      setUpcomingAppointments(sortedUpcoming);
    } catch (err) {
      console.error("❌ Błąd pobierania danych na dashboardzie:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("pl-PL", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Ładowanie danych...</div>;
  }

  const titleByRole: Record<string, string> = {
    admin: "Panel administratora",
    doctor: "Panel lekarza",
    receptionist: "Panel recepcjonistki",
    patient: "Panel pacjenta",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-4">
        {titleByRole[role || "admin"] || "Panel"}
      </h1>

      {/* Statystyki */}
      <div className="grid grid-cols-4 gap-4">
        {/* Pokazuj statystyki zależnie od roli */}
        {(role === "admin" || role === "receptionist") && (
          <>
            <div className="bg-white p-5 rounded shadow text-center">
              <p className="text-3xl font-bold text-sky-600">{counts.patients}</p>
              <p className="text-gray-600">Pacjenci</p>
            </div>
            <div className="bg-white p-5 rounded shadow text-center">
              <p className="text-3xl font-bold text-green-600">{counts.doctors}</p>
              <p className="text-gray-600">Lekarze</p>
            </div>
          </>
        )}

        {(role === "doctor" || role === "patient" || role === "admin" || role === "receptionist") && (
          <>
            <div className="bg-white p-5 rounded shadow text-center">
              <p className="text-3xl font-bold text-indigo-600">{counts.appointments}</p>
              <p className="text-gray-600">Wizyty</p>
            </div>
            <div className="bg-white p-5 rounded shadow text-center">
              <p className="text-3xl font-bold text-orange-500">{counts.upcoming}</p>
              <p className="text-gray-600">Nadchodzące wizyty</p>
            </div>
          </>
        )}
      </div>

      {/* Nadchodzące wizyty */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Najbliższe wizyty</h2>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-500">Brak nadchodzących wizyt.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Pacjent</th>
                <th className="p-2">Lekarz</th>
                <th className="p-2">Data</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.map((a) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{a.patient_name}</td>
                  <td className="p-2">{a.doctor_name}</td>
                  <td className="p-2">{formatDate(a.scheduled_at)}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        a.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : a.status === "canceled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {a.status === "completed"
                        ? "Zrealizowana"
                        : a.status === "canceled"
                        ? "Anulowana"
                        : "Zaplanowana"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
