import React, { useState } from "react";
import api from "../api/axiosConfig";

interface ReceptionistFormProps {
  onCreated: () => void;
}

export default function ReceptionistForm({ onCreated }: ReceptionistFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    work_shift: "",
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

      // 2️⃣ Tworzenie recepcjonistki
      await api.post("/receptionists/", {
        user_id: userId,
        phone: formData.phone,
        work_shift: formData.work_shift,
      });

      alert("✅ Recepcjonistka została dodana!");
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        work_shift: "",
        password: "",
      });
      onCreated();
    } catch (err) {
      console.error(err);
      alert("❌ Błąd podczas dodawania recepcjonistki");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-3">
      <h3 className="text-lg font-semibold">Dodaj recepcjonistkę</h3>

      <div className="grid grid-cols-2 gap-3">
        <input name="first_name" placeholder="Imię" value={formData.first_name} onChange={handleChange} required className="border rounded p-2" />
        <input name="last_name" placeholder="Nazwisko" value={formData.last_name} onChange={handleChange} required className="border rounded p-2" />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="border rounded p-2" />
        <input name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} className="border rounded p-2" />
        <input name="username" placeholder="Login" value={formData.username} onChange={handleChange} required className="border rounded p-2" />
        <input name="password" type="password" placeholder="Hasło" value={formData.password} onChange={handleChange} required className="border rounded p-2" />
        <input name="work_shift" placeholder="Zmiana (np. 8:00–16:00)" value={formData.work_shift} onChange={handleChange} className="border rounded p-2 col-span-2" />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">
          Dodaj
        </button>
      </div>
    </form>
  );
}
