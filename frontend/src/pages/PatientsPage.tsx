import { useEffect, useState } from "react";
import { getPatients } from "../api/patients";

interface Patient {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    getPatients().then(setPatients);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Pacjenci</h2>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Imię i nazwisko</th>
            <th className="p-2">Email</th>
            <th className="p-2">Telefon</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.full_name}</td>
              <td className="p-2">{p.email || "-"}</td>
              <td className="p-2">{p.phone || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
