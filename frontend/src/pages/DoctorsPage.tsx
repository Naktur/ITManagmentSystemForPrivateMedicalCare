import { useEffect, useState } from "react";
import { getDoctors } from "../api/doctors";
import DoctorForm from "../components/DoctorForm";

interface Doctor {
  id: number;
  full_name: string;
  specialization: string;
  phone: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const load = async () => {
    const data = await getDoctors();
    setDoctors(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Lekarze</h2>
      <DoctorForm onCreated={load} />
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Imię i nazwisko</th>
            <th className="p-2">Specjalizacja</th>
            <th className="p-2">Telefon</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.full_name}</td>
              <td className="p-2">{d.specialization || "-"}</td>
              <td className="p-2">{d.phone || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
