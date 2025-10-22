import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1️⃣ logowanie JWT
      const res = await axios.post("/api/auth/login/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // 2️⃣ pobranie danych użytkownika z rolą
      const me = await axios.get("/api/auth/me/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      const role = me.data.role;
      const fullName = me.data.full_name || me.data.username;
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", fullName);

      // 3️⃣ przekierowanie zależne od roli
      if (role === "admin") window.location.href = "/dashboard/overview";
      else if (role === "doctor") window.location.href = "/dashboard/appointments";
      else if (role === "receptionist") window.location.href = "/dashboard/appointments";
      else if (role === "patient") window.location.href = "/dashboard/chat";
      else window.location.href = "/dashboard";

    } catch (err) {
      console.error("Login error:", err);
      alert("❌ Błąd logowania – sprawdź dane użytkownika");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-4 border rounded space-y-3 shadow">
      <h2 className="text-lg font-bold text-center">Logowanie</h2>
      <form onSubmit={handleLogin} className="space-y-2">
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-2 rounded w-full hover:bg-blue-700"
        >
          Zaloguj
        </button>
      </form>
    </div>
  );
}
