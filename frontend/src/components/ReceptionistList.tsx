import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

interface Receptionist {
  id: number;
  user: { first_name: string; last_name: string; email: string };
  phone: string;
  work_shift: string;
}

export default function ReceptionistList() {
  const [list, setList] = useState<Receptionist[]>([]);
  const [editing, setEditing] = useState<Receptionist | null>(null);
  const [form, setForm] = useState({ phone: "", work_shift: "" });

  const load = async () => {
    const res = await api.get("/receptionists/");
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Usunąć tę recepcjonistkę?")) {
      await api.delete(`/receptionists/${id}/`);
      load();
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await api.put(`/receptionists/${editing.id}/`, form);
    setEditing(null);
    load();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Lista recepcjonistek</h3>
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Imię i nazwisko</th>
            <th className="p-2">Email</th>
            <th className="p-2">Telefon</th>
            <th className="p-2">Zmiana</th>
            <th className="p-2 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{r.user.first_name} {r.user.last_name}</td>
              <td className="p-2">{r.user.email}</td>
              <td className="p-2">{r.phone || "-"}</td>
              <td className="p-2">{r.work_shift || "-"}</td>
              <td className="p-2 flex justify-center gap-2">
                <button onClick={() => setEditing(r)} className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500">✏️</button>
                <button onClick={() => handleDelete(r.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <form onSubmit={handleUpdate} className="mt-4 grid grid-cols-2 gap-3">
          <input name="phone" placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border rounded p-2" />
          <input name="work_shift" placeholder="Zmiana" value={form.work_shift} onChange={(e) => setForm({ ...form, work_shift: e.target.value })} className="border rounded p-2" />
          <div className="col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Anuluj</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-sky-700">Zapisz</button>
          </div>
        </form>
      )}
    </div>
  );
}
