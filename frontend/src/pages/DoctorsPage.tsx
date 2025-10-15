import  { useEffect, useState } from "react";
import { getDoctors } from "../api/doctors";

interface Doctor {
  id: number;
  full_name: string;
  specialization: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    getDoctors().then(setDoctors);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Lekarze</h2>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Imię i nazwisko</th>
            <th className="p-2">Specjalizacja</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.full_name}</td>
              <td className="p-2">{d.specialization || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
