import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

interface Patient {
  id: number;
  full_name: string;
}

interface Doctor {
  id: number;
  full_name: string;
}

interface AppointmentFormProps {
  onCreated: () => void;
}

export default function AppointmentForm({ onCreated }: AppointmentFormProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    scheduled_at: "",
    diagnosis: "",
    notes: "",
  });

  // Lista przykładowych chorób (do podpowiedzi)
  const diseaseSuggestions = [
    "Grypa",
    "COVID-19",
    "Angina",
    "Zapalenie płuc",
    "Migrena",
    "Alergia",
    "Cukrzyca",
    "Nadciśnienie",
    "Choroba wieńcowa",
    "Depresja",
    "Astma",
    "Refluks żołądkowy",
  ];

  const [filteredDiseases, setFilteredDiseases] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Jeśli wpisywane jest "diagnosis" — pokaż sugestie
    if (name === "diagnosis") {
      const filtered = diseaseSuggestions.filter((d) =>
        d.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDiseases(filtered.slice(0, 5));
      setShowSuggestions(value.length > 0 && filtered.length > 0);
    }
  };

  const handleSelectSuggestion = (disease: string) => {
    setForm({ ...form, diagnosis: disease });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/appointments/", form);
      alert("✅ Wizyta została dodana!");
      setForm({
        patient: "",
        doctor: "",
        scheduled_at: "",
        diagnosis: "",
        notes: "",
      });
      onCreated();
    } catch (err) {
      console.error("Błąd zapisu wizyty:", err);
      alert("❌ Nie udało się zapisać wizyty.");
    }
  };

  return (
    <div className="bg-white rounded shadow p-5 max-w-3xl">
      <h3 className="text-lg font-semibold mb-4">Nowa wizyta</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 relative">
        <div>
          <label className="block text-sm font-medium mb-1">Pacjent:</label>
          <select
            name="patient"
            value={form.patient}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">-- wybierz pacjenta --</option>
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
            required
          >
            <option value="">-- wybierz lekarza --</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Termin wizyty:</label>
          <input
            type="datetime-local"
            name="scheduled_at"
            value={form.scheduled_at}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        {/* NOWE POLE: Diagnoza */}
        <div className="col-span-2 relative">
          <label className="block text-sm font-medium mb-1">Diagnoza:</label>
          <input
            type="text"
            name="diagnosis"
            placeholder="np. Grypa, Angina..."
            value={form.diagnosis}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
          {/* Sugestie podpowiedzi */}
          {showSuggestions && (
            <ul className="absolute bg-white border rounded shadow-md w-full mt-1 z-10">
              {filteredDiseases.map((disease) => (
                <li
                  key={disease}
                  onClick={() => handleSelectSuggestion(disease)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {disease}
                </li>
              ))}
            </ul>
          )}
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
