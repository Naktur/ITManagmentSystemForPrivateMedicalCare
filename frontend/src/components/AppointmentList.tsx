import { useEffect, useState } from "react";
import { getAppointments } from "../api/appointments";

interface Appointment {
  id: number;
  patient_detail: { full_name: string };
  doctor_detail: { full_name: string };
  scheduled_at: string;
  status: string;
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    getAppointments().then(setAppointments);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Lista wizyt</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th>Pacjent</th>
            <th>Lekarz</th>
            <th>Termin</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
              <td>{a.patient_detail?.full_name}</td>
              <td>{a.doctor_detail?.full_name}</td>
              <td>{new Date(a.scheduled_at).toLocaleString()}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
