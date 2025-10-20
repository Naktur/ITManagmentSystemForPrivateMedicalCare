import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

interface Patient {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  };
  pesel: string;
  phone: string;
  email: string;
  gender: string;
  date_of_birth?: string;
}

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    pesel: "",
    phone: "",
    gender: "",
    date_of_birth: "",
  });

  const load = async () => {
    const res = await api.get("/patients/");
    setPatients(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const getAge = (dob?: string) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleEdit = (patient: Patient) => {
    setEditing(patient);
    setForm({
      first_name: patient.user.first_name,
      last_name: patient.user.last_name,
      email: patient.user.email,
      pesel: patient.pesel || "",
      phone: patient.phone || "",
      gender: patient.gender || "",
      date_of_birth: patient.date_of_birth || "",
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć pacjenta?")) {
      await api.delete(`/patients/${id}/`);
      load();
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const payload = {
      user: {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
      },
      pesel: form.pesel,
      phone: form.phone,
      gender: form.gender,
      date_of_birth: form.date_of_birth,
    };

    await api.put(`/patients/${editing.id}/`, payload);
    setEditing(null);
    load();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Lista pacjentów</h3>
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Imię i nazwisko</th>
            <th className="p-2">Płeć</th>
            <th className="p-2">Wiek</th>
            <th className="p-2">Email</th>
            <th className="p-2">PESEL</th>
            <th className="p-2">Telefon</th>
            <th className="p-2 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{p.user.first_name} {p.user.last_name}</td>
              <td className="p-2">
                {p.gender === "male" ? "Mężczyzna" :
                 p.gender === "female" ? "Kobieta" :
                 p.gender === "other" ? "Inna" : "-"}
              </td>
              <td className="p-2">{getAge(p.date_of_birth)}</td>
              <td className="p-2">{p.user.email}</td>
              <td className="p-2">{p.pesel || "-"}</td>
              <td className="p-2">{p.phone || "-"}</td>
              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="mt-6 border rounded bg-gray-50 p-4">
          <h4 className="font-semibold mb-3">
            Edytuj pacjenta: {editing.user.first_name} {editing.user.last_name}
          </h4>
          <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
            <input name="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="Imię" className="border p-2 rounded" />
            <input name="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Nazwisko" className="border p-2 rounded" />
            <input name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="border p-2 rounded col-span-2" />
            <select name="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="border p-2 rounded col-span-1">
              <option value="">-- płeć --</option>
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
              <option value="other">Inna</option>
            </select>
            <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="border p-2 rounded col-span-1" />
            <input name="pesel" value={form.pesel} onChange={(e) => setForm({ ...form, pesel: e.target.value })} placeholder="PESEL" className="border p-2 rounded col-span-2" />
            <input name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefon" className="border p-2 rounded col-span-2" />

            <div className="col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Anuluj</button>
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-sky-700">Zapisz</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
