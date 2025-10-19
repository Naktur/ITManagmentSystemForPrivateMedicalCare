// frontend/src/components/AppointmentForm.tsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

interface Patient {
  id: number;
  full_name: string; // <-- teraz na pewno przychodzi z API
}

interface Doctor {
  id: number;
  full_name: string; // <-- jw.
}

export default function AppointmentForm() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    scheduled_at: "",
    notes: "",
  });

  const loadData = async () => {
    try {
      const [pRes, dRes] = await Promise.all([
        api.get("/patients/"),
        api.get("/doctors/"),
      ]);
      setPatients(pRes.data);
      setDoctors(dRes.data);
    } catch (err) {
      console.error("Błąd ładowania danych:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/appointments/", form);
      setForm({ patient: "", doctor: "", scheduled_at: "", notes: "" });
      loadData();
    } catch (err) {
      console.error("Błąd zapisu wizyty:", err);
      alert("Nie udało się zapisać wizyty");
    }
  };

  return (
    <div className="bg-white rounded shadow p-5 max-w-3xl">
      <h3 className="text-lg font-semibold mb-4">Nowa wizyta</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pacjent:</label>
          <select
            name="patient"
            value={form.patient}
            onChange={handleChange}
            className="border rounded w-full p-2"
          >
            <option value="">-- wybierz --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lekarz:</label>
          <select
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            className="border rounded w-full p-2"
          >
            <option value="">-- wybierz --</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Termin:</label>
          <input
            type="datetime-local"
            name="scheduled_at"
            value={form.scheduled_at}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Notatki:</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="border rounded w-full p-2"
          />
        </div>

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
          >
            Zapisz wizytę
          </button>
        </div>
      </form>
    </div>
  );
}
