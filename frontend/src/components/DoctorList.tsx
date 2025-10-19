import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

interface Doctor {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  };
  specialization: string;
  phone: string;
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    specialization: "",
    phone: "",
  });

  const load = async () => {
    const res = await api.get("/doctors/");
    setDoctors(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (doctor: Doctor) => {
    setEditing(doctor);
    setForm({
      first_name: doctor.user.first_name,
      last_name: doctor.user.last_name,
      email: doctor.user.email,
      specialization: doctor.specialization,
      phone: doctor.phone,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć lekarza?")) {
      await api.delete(`/doctors/${id}/`);
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
      specialization: form.specialization,
      phone: form.phone,
    };

    await api.put(`/doctors/${editing.id}/`, payload);
    setEditing(null);
    load();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Lista lekarzy</h3>
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Imię i nazwisko</th>
            <th className="p-2">Email</th>
            <th className="p-2">Specjalizacja</th>
            <th className="p-2">Telefon</th>
            <th className="p-2 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id} className="border-t hover:bg-gray-50">
              <td className="p-2">
                {d.user.first_name} {d.user.last_name}
              </td>
              <td className="p-2">{d.user.email}</td>
              <td className="p-2">{d.specialization || "-"}</td>
              <td className="p-2">{d.phone || "-"}</td>
              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(d)}
                  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
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
            Edytuj lekarza: {editing.user.first_name} {editing.user.last_name}
          </h4>
          <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
            <input
              name="first_name"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
              placeholder="Imię"
              className="border p-2 rounded"
            />
            <input
              name="last_name"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
              placeholder="Nazwisko"
              className="border p-2 rounded"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="border p-2 rounded col-span-2"
            />
            <input
              name="specialization"
              value={form.specialization}
              onChange={(e) =>
                setForm({ ...form, specialization: e.target.value })
              }
              placeholder="Specjalizacja"
              className="border p-2 rounded col-span-2"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Telefon"
              className="border p-2 rounded col-span-2"
            />

            <div className="col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-sky-700"
              >
                Zapisz
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
