import React, { useState } from "react";
import api from "../api/axiosConfig"; // ✅ używamy naszego axiosa z tokenem

interface DoctorFormProps {
  onCreated: () => void;
}

export default function DoctorForm({ onCreated }: DoctorFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    specialization: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 1️⃣ Tworzymy użytkownika
    const userRes = await api.post("/auth/register/", {
      username: formData.username,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      password: formData.password,
    });

    const userId = userRes.data.id; // ⬅️ bierzemy id użytkownika

    // 2️⃣ Tworzymy lekarza z przypisanym user_id
    await api.post("/doctors/", {
      user_id: userId, // ⬅️ przekazujemy user_id do backendu
      phone: formData.phone,
      specialization: formData.specialization,
    });

    alert("Lekarz został dodany ✅");
    setFormData({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      specialization: "",
      password: "",
    });
    onCreated();
  } catch (err) {
    console.error("Błąd podczas dodawania lekarza:", err);
    alert("Błąd podczas dodawania lekarza");
  }
};


  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-3">
      <h3 className="text-lg font-semibold">Dodaj lekarza</h3>
      <div className="grid grid-cols-2 gap-3">
        <input name="first_name" placeholder="Imię" value={formData.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Nazwisko" value={formData.last_name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} />
        <input name="username" placeholder="Login" value={formData.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Hasło" value={formData.password} onChange={handleChange} required />
        <input name="specialization" placeholder="Specjalizacja" value={formData.specialization} onChange={handleChange} />
      </div>
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-sky-700">
        Dodaj lekarza
      </button>
    </form>
  );
}
