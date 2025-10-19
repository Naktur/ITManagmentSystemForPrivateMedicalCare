import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

interface Appointment {
  id: number;
  patient_name: string;
  doctor_name: string;
  scheduled_at: string;
  status: string;
  notes: string;
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [form, setForm] = useState({
    scheduled_at: "",
    status: "",
    notes: "",
  });

  const load = async () => {
    const res = await api.get("/appointments/");
    setAppointments(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (a: Appointment) => {
    setEditing(a);
    setForm({
      scheduled_at: a.scheduled_at,
      status: a.status,
      notes: a.notes,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć wizytę?")) {
      await api.delete(`/appointments/${id}/`);
      load();
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await api.put(`/appointments/${editing.id}/`, form);
    setEditing(null);
    load();
  };

  const formatDate = (iso: string) => {
    if (!iso) return "-";
    const date = new Date(iso);
    return date.toLocaleString("pl-PL", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const renderStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
    };
    const label: Record<string, string> = {
      scheduled: "Zaplanowana",
      completed: "Zrealizowana",
      canceled: "Anulowana",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded ${colors[status] || "bg-gray-100 text-gray-600"}`}
      >
        {label[status] || status}
      </span>
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Lista wizyt</h3>

      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Pacjent</th>
            <th className="p-2">Lekarz</th>
            <th className="p-2">Data</th>
            <th className="p-2">Status</th>
            <th className="p-2">Notatki</th>
            <th className="p-2 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                Brak wizyt
              </td>
            </tr>
          )}

          {appointments.map((a) => (
            <tr key={a.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{a.patient_name}</td>
              <td className="p-2">{a.doctor_name}</td>
              <td className="p-2">{formatDate(a.scheduled_at)}</td>
              <td className="p-2">{renderStatusBadge(a.status)}</td>
              <td className="p-2">{a.notes || "-"}</td>
              <td className="p-2 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(a)}
                  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
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
            Edytuj wizytę ({editing.patient_name} → {editing.doctor_name})
          </h4>
          <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data i godzina</label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="scheduled">Zaplanowana</option>
                <option value="completed">Zrealizowana</option>
                <option value="canceled">Anulowana</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Notatki</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="border p-2 rounded w-full"
              />
            </div>

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
