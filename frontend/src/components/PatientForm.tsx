import React, { useState } from "react";
import api from "../api/axiosConfig";

interface PatientFormProps {
  onCreated: () => void;
}

export default function PatientForm({ onCreated }: PatientFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    pesel: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1️⃣ Rejestracja użytkownika
      const userRes = await api.post("/auth/register/", {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
      });

      const userId = userRes.data.id;

      // 2️⃣ Tworzenie pacjenta powiązanego z tym userem
      const patientPayload = {
        user_id: userId,
        phone: formData.phone,
        pesel: formData.pesel,
        email: formData.email, // 👈 ważne — pole wymagane w modelu Patient
      };

      console.log("📤 POST /patients/:", patientPayload); // podgląd w konsoli

      await api.post("/patients/", patientPayload);

      alert("✅ Pacjent został dodany!");
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        pesel: "",
        password: "",
      });
      onCreated();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Błąd podczas dodawania pacjenta:", err);
      if (err.response?.data) {
        alert("Błąd walidacji: " + JSON.stringify(err.response.data));
      } else {
        alert("Nie udało się dodać pacjenta.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded p-4 space-y-3"
    >
      <h3 className="text-lg font-semibold">Dodaj pacjenta</h3>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="first_name"
          placeholder="Imię"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="last_name"
          placeholder="Nazwisko"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="phone"
          placeholder="Telefon"
          value={formData.phone}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          name="username"
          placeholder="Login"
          value={formData.username}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Hasło"
          value={formData.password}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
        <input
          name="pesel"
          placeholder="PESEL"
          value={formData.pesel}
          onChange={handleChange}
          className="border rounded p-2 col-span-2"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
        >
          Dodaj pacjenta
        </button>
      </div>
    </form>
  );
}
