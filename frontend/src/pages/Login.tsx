/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      window.location.href = "/"; // przekierowanie do Dashboard
    } catch (err) {
      alert("Błąd logowania – sprawdź dane użytkownika");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-4 border rounded space-y-3">
      <h2 className="text-lg font-bold text-center">Logowanie</h2>
      <form onSubmit={handleLogin} className="space-y-2">
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded w-full">
          Zaloguj
        </button>
      </form>
    </div>
  );
}
