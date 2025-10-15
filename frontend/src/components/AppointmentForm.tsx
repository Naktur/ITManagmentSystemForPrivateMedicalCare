import React, { useEffect, useState } from "react";
import { getPatients } from "../api/patients";
import { getDoctors } from "../api/doctors";
import { createAppointment } from "../api/appointments";

interface Patient {
  id: number;
  full_name: string;
}

interface Doctor {
  id: number;
  full_name: string;
}

export default function AppointmentForm() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    scheduled_at: "",
    notes: ""
  });

  useEffect(() => {
    // Pobieramy pacjentów i lekarzy
    getPatients().then(setPatients);
    getDoctors().then(setDoctors);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAppointment(formData);
    alert("Wizyta została dodana!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md max-w-md mx-auto space-y-3">
      <h2 className="text-xl font-bold mb-2">Nowa wizyta</h2>

      <label>Pacjent:</label>
      <select name="patient" value={formData.patient} onChange={handleChange} required>
        <option value="">-- wybierz --</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>{p.full_name || p.full_name}</option>

        ))}
      </select>

      <label>Lekarz:</label>
      <select name="doctor" value={formData.doctor} onChange={handleChange} required>
        <option value="">-- wybierz --</option>
        {doctors.map((d) => (
          <option key={d.id} value={d.id}>{d.full_name || d.full_name}</option>
        ))}
      </select>

      <label>Termin:</label>
      <input type="datetime-local" name="scheduled_at" value={formData.scheduled_at} onChange={handleChange} required />

      <label>Notatki:</label>
      <textarea name="notes" value={formData.notes} onChange={handleChange} />

      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
        Zapisz wizytę
      </button>
    </form>
  );
}
