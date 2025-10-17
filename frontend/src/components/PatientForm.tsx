import React, { useState } from "react";
import api from "../api/axiosConfig"; // ✅

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
      // 1️⃣ rejestracja nowego usera (bez tokena)
      const userRes = await api.post("/auth/register/", {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
      });

      const userId = userRes.data.id;

      // 2️⃣ utworzenie pacjenta (z tokenem admina)
      await api.post("/patients/", {
        user_id: userId,
        phone: formData.phone,
        pesel: formData.pesel,
      });

      alert("Pacjent został dodany ✅");
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
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania pacjenta");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-3">
      <h3 className="text-lg font-semibold">Dodaj pacjenta</h3>
      <div className="grid grid-cols-2 gap-3">
        <input name="first_name" placeholder="Imię" value={formData.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Nazwisko" value={formData.last_name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} />
        <input name="username" placeholder="Login" value={formData.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Hasło" value={formData.password} onChange={handleChange} required />
        <input name="pesel" placeholder="PESEL" value={formData.pesel} onChange={handleChange} />
      </div>
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-sky-700">
        Dodaj pacjenta
      </button>
    </form>
  );
}
